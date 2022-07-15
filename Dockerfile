FROM nikolaik/python-nodejs:python3.10-nodejs16 AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .


ENV NODE_OPTIONS="--max_old_space_size=8192"
RUN yarn --verbose build-all


FROM nikolaik/python-nodejs:python3.10-nodejs16 AS backend

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist/apps/playlistr-be .
COPY --from=build /usr/src/app/node_modules node_modules/
COPY --from=build /usr/src/app/data data/

CMD ["node", "main"]

FROM nginx AS frontend

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /usr/src/app/dist/apps/playlistr-fe /usr/share/nginx/html

