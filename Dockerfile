FROM node:13.12.0-alpine

RUN mkdir -p /app &&\
 chown -R root:root /app

WORKDIR /app

RUN chgrp -R 0 /app &&\
 chmod -R g+rwX /app

COPY package*.json /app/

RUN npm install --no-cache

RUN mkdir -p /app/node_modules/.cache &&\
 chown -R root:root /app/node_modules/.cache &&\
 chmod -R 777 /app/node_modules/.cache



COPY . ./

EXPOSE 3000

CMD ["npm", "start"]