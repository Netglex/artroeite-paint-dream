FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "yarn-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
ARG VITE_ENVOY_URL
ENV VITE_ENVOY_URL $VITE_ENVOY_URL
COPY . .
EXPOSE 4173
RUN chown -R node /usr/src/app
USER node
RUN ["yarn", "build"]
CMD ["yarn", "preview"]
