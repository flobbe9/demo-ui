FROM node

WORKDIR /app

COPY . /app/

RUN npm ci

RUN npm run build

ENTRYPOINT npm start