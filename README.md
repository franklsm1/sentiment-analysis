# React, Express, and MySQL App to track sentiment Analysis

### Setup MySQL locally
1) install MySQL (on a mac) with: `brew install mysql`
1) start MySQL with: `mysql.server start`
1) access MySQL with: `mysql -u root`
1) inside of MySQL run the following command to create the databases that this app uses:
- `create database sentiment_db;`
1) exit mysql CLI: `exit`

### Setup required to start app (after mysql is started)
1) Run migrations to create table and add test data to the DB: `yarn migrate`
1) create a `.env` file and add valid twitter API credentials like so:
```
NETWORK_ENV=
TWITTER_BEARER_TOKEN=
```
**Note:** `NETWORK_ENV` can either be 'PROXY' or empty. This tells the app whether to set the proxy if on a corporate internet.

### Commands:
**Note**: May need to give build:prod script permissions to execute (`chmod +x ./build.sh`)
- Run locally in watch mode: `yarn local`
- Run all tests: `yarn test`
- Start server w/o watch mode: `yarn start`
- Build and package into a zip: `yarn build:prod`
- Run knex migrations: `yarn migrate`
- Run knex migrations for test DB: `NODE_ENV=test yarn migrate`
- Rollback knex migrations: `yarn rollback`
- Rollback knex migrations for test DB: `NODE_ENV=test yarn rollback`

## Standards
- This project uses [semistandard](https://standardjs.com/) eslint setup
- `yarn test` runs the linter and all tests
- Husky pre-commit hook requires the `test` script to pass
- Run `yarn lint:fix` to fix lint issues