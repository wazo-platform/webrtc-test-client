FROM node:20-alpine AS build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY src/* /usr/src/app/src/
COPY tsconfig.json webpack.config.js /usr/src/app/

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]