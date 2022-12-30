FROM node:16.13.0

WORKDIR /app

COPY ./package*.json ./
COPY src ./src
COPY tsconfig.build.json ./
COPY tsconfig.json ./

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]