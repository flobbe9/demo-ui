FROM node

WORKDIR /app/demo/ui

COPY . /app/demo/ui//

RUN npm ci

CMD npm start