FROM node:22.13.1

ARG EXPOSE_PORT

RUN mkdir /usr/src/app
WORKDIR   /usr/src/app

COPY ./package.json /usr/src/app/package.json
COPY ./index.js     /usr/src/app/index.js

CMD [ "npm", "start" ]