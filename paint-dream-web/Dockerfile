FROM node:20-alpine
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn --silent

ARG VITE_ENVOY_PROTOCOL
ARG VITE_ENVOY_PORT
ENV VITE_ENVOY_PROTOCOL $VITE_ENVOY_PROTOCOL
ENV VITE_ENVOY_PORT $VITE_ENVOY_PORT

COPY . .
RUN yarn build

FROM nginx
COPY --from=0 /usr/src/app/dist /usr/share/nginx/html