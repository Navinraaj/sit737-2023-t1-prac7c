from node:16-alpine

WORKDIR /app

COPY . .

EXPOSE 8080

RUN npm install

HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

CMD ["npm","start"]