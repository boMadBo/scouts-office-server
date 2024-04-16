FROM node:18.13.0

WORKDIR /app


COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install

COPY . .

COPY ./dist ./dist

EXPOSE 80

CMD [ "yarn", "start:dev" ] 