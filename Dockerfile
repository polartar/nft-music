FROM ubuntu:20.04




WORKDIR /tmp/ffmpeg

RUN apt-get -y update
RUN apt-get install -y ffmpeg

WORKDIR /app

RUN apt-get update
RUN apt install -y git
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get -y install nodejs

COPY package*.json ./
COPY . .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8081
CMD [ "npm", "run", "server" ]