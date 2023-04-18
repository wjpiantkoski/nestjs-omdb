FROM node:16.20.0-alpine3.17

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm run build

FROM node:16.20.0-alpine3.17

WORKDIR /app

COPY package.json ./

RUN npm install

COPY --from=0 /app/dist .

RUN npm install pm2 -g

CMD ["pm2-runtime","./main.js"]