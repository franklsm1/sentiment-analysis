#!/usr/bin/env bash

cd client
yarn install --production
yarn build

cd ..
yarn install
yarn test
rm -rf node_modules
yarn install --production
zip -r sentiment-analysis package.json server.js node_modules client/build