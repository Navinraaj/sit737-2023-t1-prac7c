FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install

COPY server.js .

EXPOSE 8080

HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

CMD [ "node","server.js" ]