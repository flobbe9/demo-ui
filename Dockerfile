FROM node

WORKDIR /app

COPY . ./

ARG SSL_PASSWORD=password
ARG SSL_CRT_FILE=ssl/localhost.crt.pem
ARG SSL_KEY_FILE=ssl/localhost.key.pem
ARG SSL_KEYSTORE_FILE=ssl/localhost.p12

# generate ssl files, default is self signed localhost.p12 certificate
RUN apt-get install libssl-dev
RUN openssl pkcs12 -in ./${SSL_KEYSTORE_FILE} -out ./${SSL_CRT_FILE} -clcerts -nokeys -passin pass:${SSL_PASSWORD}
RUN openssl pkcs12 -in ./${SSL_KEYSTORE_FILE} -out ./${SSL_KEY_FILE} -nocerts -nodes  -passin pass:${SSL_PASSWORD}

RUN npm ci

RUN npm run build

ENTRYPOINT npm start