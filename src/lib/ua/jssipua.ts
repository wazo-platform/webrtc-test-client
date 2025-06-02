// 'use strict';

// import { RTCSession } from "jssip/lib/RTCSession";
// import { UAConfiguration } from "jssip/lib/UA";
// import JsSIP, { UA } from 'jssip';

// // If your socket has a specific type/interface, replace 'any' with it
// type SocketType = any;

// interface Peer {
//     name: string;
//     password: string;
//     domain: string;
// }

// class JsSipUA {
//     private peerName: string;
//     private peerPwd: string;
//     private peerDomain: string;
//     private socket: SocketType;
//     private userAgent: string;
//     private ua: UA;

//     constructor(peer: Peer, socket: SocketType, userAgent: string) {
//         this.peerName = peer.name;
//         this.peerPwd = peer.password;
//         this.peerDomain = peer.domain;
//         this.socket = socket;
//         this.userAgent = userAgent;
//         this.ua = this.createSipUa(socket);
//     }

//     private createSipUa(socket: SocketType): UA {
//         const uaConfig: UAConfiguration = {
//             uri: `sip:${this.peerName}@${this.peerDomain}`,
//             authorization_user: this.peerName,
//             password: this.peerPwd,
//             display_name: this.peerName,
//             sockets: [socket],
//             register: true,
//             user_agent: this.userAgent,
//         };
//         const ua = new JsSIP.UA(uaConfig);
//         console.log('JsSIP ua created for peer: ', this.peerName);
//         console.log('Socket: ', socket);
//         return ua;
//     }

//     public setRegisterHandlers(): void {
//         this.ua.on('registered', (e: any) => {
//             console.log('Peer ' + this.peerName + ' registered');
//         });
//         this.ua.on('unregistered', (e: any) => {
//             console.warn('Peer ' + this.peerName + ' unregistered');
//         });
//         this.ua.on('registrationFailed', (e: any) => {
//             console.error('Registration failed for peer ' + this.peerName);
//         });
//     }

//     public start(): void {
//         this.ua.start();
//         if (typeof this.socket.isConnected === 'function') {
//             console.log('connected: ', this.socket.isConnected());
//         }
//         console.log("User Agent Created.");
//     }

//     public checkState(): void {
//         if (typeof this.socket.isConnected === 'function') {
//             console.log('Socket connection state: ', this.socket.isConnected());
//         }
//         if (typeof this.ua.isRegistered === 'function') {
//             console.log('UA for peer registration state: ', this.ua.isRegistered());
//         }
//     }

//     public call(destination: string): RTCSession {
//         return this.ua.call(destination);
//     }

//     public hangup(): void {
//         this.ua.terminateSessions();
//     }
// }

// export default JsSipUA;
