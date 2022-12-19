FROM node:16.13.0

WORKDIR /app

COPY ./package*.json ./
RUN npm install
COPY src ./src
COPY tsconfig.build.json ./
COPY tsconfig.json ./

EXPOSE 3000

CMD [ "npm", "run", "start" ]