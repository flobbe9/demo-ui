# build project
FROM node:20.11.0

COPY . .

# generate ssl files, default is self signed localhost.p12 certificate
ARG SSL_PASSWORD=password
ARG SSL_CRT_FILE=localhost.crt.pem
ARG SSL_KEY_FILE=localhost.key.pem
ARG SSL_KEYSTORE_FILE=localhost.p12

RUN apt-get install libssl-dev
RUN openssl pkcs12 -in ./ssl/${SSL_KEYSTORE_FILE} -out ./ssl/${SSL_CRT_FILE} -clcerts -nokeys -passin pass:${SSL_PASSWORD}
RUN openssl pkcs12 -in ./ssl/${SSL_KEYSTORE_FILE} -out ./ssl/${SSL_KEY_FILE} -nocerts -nodes  -passin pass:${SSL_PASSWORD}

# install packages
RUN npm i
RUN npm run build


# copy necessary files only
FROM node:20.11.0-slim

WORKDIR /app

ARG PORT=443
ENV PORT_ENV=${PORT}

COPY --from=0 /build ./build
COPY --from=0 /package.json ./

RUN npm i -g serve
ENTRYPOINT serve ./build -l ${PORT_ENV} -n