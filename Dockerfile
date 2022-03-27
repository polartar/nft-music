FROM node:14-alpine

RUN apk add --update git
RUN apk add --no-cache ffmpeg

COPY package*.json ./

RUN npm install && npm run build

COPY . .

EXPOSE 8081
CMD [ "npm", "run", "server" ]