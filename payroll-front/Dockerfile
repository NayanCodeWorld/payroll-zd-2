FROM node:16-alpine

WORKDIR /app

COPY package*.json  /app/

RUN npm i --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
