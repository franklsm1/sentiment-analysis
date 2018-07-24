#!/usr/bin/env bash

cd client
yarn install --production
yarn build

cd ..
yarn install --production
zip -r build package.json server.js node_modules client/build