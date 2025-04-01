FROM node:20-alpine

WORKDIR /home/node/app
COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE ${PORT}
CMD ["npm", "start"]