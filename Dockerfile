FROM node:20-alpine as js

WORKDIR /app

COPY package.* ./

RUN npm install --quiet --unsafe-perm=true --allow-root \
    && mkdir -p node_modules/.cache \
    && chmod -R 777 node_modules/.cache