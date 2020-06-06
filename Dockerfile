FROM node:12-slim
LABEL name "sentiment-analysis"

# dumb-init helps prevent zombie processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Create app directory
COPY . /app/
WORKDIR app

# Lint, test, and build the app
ENV NODE_ENV=production
RUN yarn installBoth:prod
RUN yarn buildBoth
RUN cp package.json ./dist
RUN cp -r ./client/build ./dist/client
WORKDIR dist

# Set and expose app port, default to 443
ENV PORT=${PORT:-443}
EXPOSE $PORT

# Start app
ENTRYPOINT ["dumb-init", "--"]
CMD ["yarn", "start:prod"]
