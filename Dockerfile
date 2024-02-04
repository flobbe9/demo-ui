FROM node

WORKDIR /app

COPY . ./

RUN npm ci

RUN npm run build

ENTRYPOINT npm start