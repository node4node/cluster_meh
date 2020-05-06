FROM node:current AS transpiled

WORKDIR /build

COPY package.json tsconfig.json index.ts cluster.ts ./

RUN npm install && \
RUN tsc

FROM node:lts-slim

WORKDIR /server

COPY package.json . && \
COPY --from=transpiled /build/src src/

RUN npm install --production

EXPOSE 3000

CMD ["npm", "run", "cluster"]