FROM wonderlic/node:16-alpine-builder as build

WORKDIR /build
COPY package.json ./
RUN npm install --only=production

#---------------------------------------------------------------------
FROM wonderlic/node:16-alpine
LABEL maintainer="Wonderlic DevOps <DevOps@wonderlic.com>"

WORKDIR /app
COPY --from=build /build/node_modules ./node_modules
COPY config.js mailer.js server.js package.json ./

RUN ln -s /usr/bin/node /app/smtp-to-mailgun

CMD ["/app/smtp-to-mailgun", "/app/server.js"]
