FROM node

WORKDIR /app

# Generate ssl files, default is self signed localhost.p12 certificate
COPY . .

ARG SSL_PASSWORD=password
ARG SSL_CRT_FILE=localhost.crt.pem
ARG SSL_KEY_FILE=localhost.key.pem
ARG SSL_KEYSTORE_FILE=localhost.p12

RUN apt-get install libssl-dev
RUN openssl pkcs12 -in ./ssl/${SSL_KEYSTORE_FILE} -out ./ssl/${SSL_CRT_FILE} -clcerts -nokeys -passin pass:${SSL_PASSWORD}
RUN openssl pkcs12 -in ./ssl/${SSL_KEYSTORE_FILE} -out ./ssl/${SSL_KEY_FILE} -nocerts -nodes  -passin pass:${SSL_PASSWORD}


# Setup react
RUN npm i
RUN npm run build

# copy only build folder
FROM node

WORKDIR /app

COPY --from=0 /app/build ./

RUN npm i serve

ENTRYPOINT serve -s build -p ${PORT}