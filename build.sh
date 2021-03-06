#!/usr/bin/env bash

cd client
export SKIP_PREFLIGHT_CHECK=true
yarn install
yarn build

cd ..
yarn clean
yarn install
yarn build
cp package.json ./dist
cp -r ./client/build ./dist/client
cd dist
yarn install --prod
# zip -r sentiment-analysis .
