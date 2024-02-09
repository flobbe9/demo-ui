# global args
# dont give HTTPS a default value
ARG HTTPS
ARG SSL_KEYSTORE_FILE=localhost.p12
ARG SSL_PASSWORD=password
ARG SSL_CRT_FILE=localhost.crt.pem
ARG SSL_KEY_FILE=localhost.key.pem
ARG PORT=443


# build project
FROM node:20.11.0

ARG SSL_KEYSTORE_FILE
ARG SSL_PASSWORD
ARG SSL_CRT_FILE
ARG SSL_KEY_FILE
ARG PORT

COPY . .

# generate ssl files, default is self signed localhost.p12 certificate
RUN apt-get install libssl-dev
RUN openssl pkcs12 -in ./ssl/${SSL_KEYSTORE_FILE} -out ./ssl/${SSL_CRT_FILE} -clcerts -nokeys -passin pass:${SSL_PASSWORD}
RUN openssl pkcs12 -in ./ssl/${SSL_KEYSTORE_FILE} -out ./ssl/${SSL_KEY_FILE} -nocerts -nodes  -passin pass:${SSL_PASSWORD}

# install packages
RUN npm i
RUN npm run build


# run project
FROM node:20.11.0-slim

WORKDIR /app

ARG HTTPS
ENV HTTPS_ENV=${HTTPS}
ARG SSL_CRT_FILE
ENV SSL_CRT_FILE_ENV=${SSL_CRT_FILE}
ARG SSL_KEY_FILE
ENV SSL_KEY_FILE_ENV=${SSL_KEY_FILE}
ARG PORT
ENV PORT_ENV=${PORT}

COPY --from=0 /build ./build
COPY --from=0 /package.json .
COPY --from=0 /ssl .

RUN npm i -g serve

ENTRYPOINT if [ "$HTTPS_ENV" ] ; \
           then serve -s -L ./build -l ${PORT_ENV} -n --no-port-switching --ssl-cert ./${SSL_CRT_FILE_ENV} --ssl-key ./${SSL_KEY_FILE_ENV} ; \
           else serve -s -L ./build -l ${PORT_ENV} -n --no-port-switching ; \
           fi