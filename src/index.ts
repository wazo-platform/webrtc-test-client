'use strict';

import { Inviter, Session, SessionState, UserAgent, Registerer, Web } from "sip.js";

const SIP_USER_AGENT: string = 'Wazo WebRTC Codec Test';

const SIP_USER_ID: string = "sipUser";
const SIP_PWD_ID: string = "sipPassword";
const SIP_SERVER_HOST_ID: string = "sipServerHost";
const SIP_DOMAIN_ID: string = "sipDomain";
const CALL_DST_ID: string = "callDestination";
const CODEC_INCOMING_ID: string = "incoming";
const CODEC_OUTGOING_ID: string = "outgoing";
const STATUS_ID: string = "status";
const AUDIO_ID: string = "audio";

const CALL_BTN_ID: string = "call";
const HANGUP_BTN_ID: string = "hangup";

function getSipDomain(): string {
    return (<HTMLInputElement>document.getElementById(SIP_DOMAIN_ID)).value;
}

function getUserAgent(): UserAgent {
    const sipUser = (<HTMLInputElement>document.getElementById(SIP_USER_ID)).value;
    const sipPassword = (<HTMLInputElement>document.getElementById(SIP_PWD_ID)).value;
    const sipDomain = getSipDomain();
    const sipServerHost = (<HTMLInputElement>document.getElementById(SIP_SERVER_HOST_ID)).value;

    const userAgent: UserAgent = new UserAgent({
        uri: UserAgent.makeURI(`sip:${sipUser}@${sipDomain}`),
        userAgentString: SIP_USER_AGENT,
        authorizationUsername: sipUser,
        authorizationPassword: sipPassword,
        transportOptions: {
            server: `wss://${sipServerHost}/api/asterisk/ws`
        }
    });
    return userAgent;
}

function updatePage(id: string, status: string, append?: boolean): void {
    if (typeof (append) === 'undefined') {
        append = true;
    }

    const call: Element = document.getElementById(id);
    console.log('Append: ', append, call.hasChildNodes(), JSON.stringify(status));
    if (!call.hasChildNodes() || append == true) {
        const p: Element = document.createElement("p");
        p.textContent = status;
        call?.appendChild(p);
        console.log('Updating page: ', id, status);
    }
}

const audioElement = document.getElementById(AUDIO_ID) as HTMLMediaElement;

const remoteStream = new MediaStream();
function setupRemoteMedia(session: Session) {
    const sdh = session.sessionDescriptionHandler as Web.SessionDescriptionHandler;;
    sdh.peerConnection.getReceivers().forEach((receiver) => {
        if (receiver.track) {
            remoteStream.addTrack(receiver.track);
        }
    });
    audioElement.srcObject = remoteStream;
    audioElement.play();
}

function cleanupMedia() {
    audioElement.srcObject = null;
    audioElement.pause();
}

function handleStats(session: Session) {
    const sdh = session.sessionDescriptionHandler as Web.SessionDescriptionHandler;;
    sdh.peerConnection.getStats(null).then((report: RTCStatsReport) => {
        report.forEach((value, key, parent) => {
            if (value.type == 'codec') {
                key.startsWith('CO') ? updatePage(CODEC_OUTGOING_ID, value.mimeType, false) : updatePage(CODEC_INCOMING_ID, value.mimeType, false);
            }
        });
    });
}

function call(dst: String): void {
    const userAgent = getUserAgent();
    const registerer: Registerer = new Registerer(userAgent);
    userAgent.start().then(() => {
        registerer.register();
        const target = UserAgent.makeURI(`sip:${dst}@${getSipDomain()}`);
        if (!target) {
            throw new Error("Failed to create target URI.");
        }

        const inviter = new Inviter(userAgent, target, {
            sessionDescriptionHandlerOptions: {
                constraints: { audio: true, video: false }
            }
        });

        let statsInterval = null;
        inviter.stateChange.addListener((newState) => {
            switch (newState) {
                case SessionState.Establishing:
                    updatePage(STATUS_ID, 'Establishing');
                    break;
                case SessionState.Established:
                    updatePage(STATUS_ID, 'Connected');
                    setupRemoteMedia(inviter);
                    statsInterval = setInterval(() => { handleStats(inviter); }, 1000);
                    break;
                case SessionState.Terminated:
                    clearInterval(statsInterval);
                    cleanupMedia();
                    updatePage(STATUS_ID, 'Terminated');
                    break;
                default:
                    break;
            }
        });

        inviter.invite()
            .then(() => {
                console.log('Invite sent');
                const hangupBtn = document.getElementById(HANGUP_BTN_ID);
                hangupBtn.addEventListener('click', (e: Event) => inviter.bye());

            })
            .catch((error: Error) => {
                console.error('Call failed because of: ', error);
            });
    });
}

const callBtn = document.getElementById(CALL_BTN_ID);
callBtn.addEventListener('click', (e: Event) => {
    const dst = (<HTMLInputElement>document.getElementById(CALL_DST_ID)).value as string;
    call(dst);
});
