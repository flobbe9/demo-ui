FROM node

WORKDIR /app/frontend/ui

COPY . /app/frontend/ui/

RUN npm ci

CMD npm start