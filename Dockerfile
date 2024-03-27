FROM node:18.20-alpine

WORKDIR /app

COPY server/package*.json ./

RUN npm install --production

RUN mkdir -p dist
ADD server/dist ./dist

RUN mkdir -p public
ADD server/public ./public
# COPY server ./

RUN ls -l

EXPOSE 3002

CMD [ "node", "dist/main.js" ]
