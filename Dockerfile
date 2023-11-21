FROM node:20-alpine as js

WORKDIR /app

COPY frontend/package.* ./

RUN npm install --quiet --unsafe-perm=true --allow-root \
    && mkdir -p node_modules/.cache \
    && chmod -R 777 node_modules/.cache

FROM golang:1.21.3-alpine as go

WORKDIR /go/src/app
COPY ./api/* ./

#RUN go get -d -v ./...
#RUN go install -v ./...

CMD ["app"]

FROM golangci/golangci-lint:v1.55-alpine as go-lint

RUN apk update \
    && apk add jq \
    && chmod +x /usr/bin/jq

FROM amaysim/serverless:3.36.0 as serverless

RUN mkdir /app

WORKDIR /app