FROM node:14-alpine

RUN apk add --update git
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/dist
RUN npm run build

EXPOSE 8081
CMD [ "npm", "run", "start" ]