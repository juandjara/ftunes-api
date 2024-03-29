FROM node:10-alpine

RUN apk --no-cache add ffmpeg git
WORKDIR /home/node/app

ENV PATH /home/node/app/node_modules/.bin:$PATH
ENV NODE_ENV production

COPY package*.json /home/node/app/
RUN npm ci

COPY . /home/node/app

EXPOSE 3000

CMD [ "npm", "start" ]
