FROM node:12.13-alpine As development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=development
COPY . .
RUN npm run build

FROM node:12.13-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV} \
    MONGO_CONNECTION_URL='mongodb+srv://backender:Up35ATzGTR387I2t@cluster0.fscez.mongodb.net/soccer?retryWrites=true&w=majority' \
    PORT=3000 \
    MATCHES_API_URL=https://api.jsonbin.io/b/5ebb0cf58284f36af7ba1779/1

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main"]
