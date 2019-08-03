# React, Express, and MySQL App to track sentiment Analysis

### Setup MySQL locally
1) install MySQL (on a mac) with: `brew install mysql`
1) start MySQL with: `mysql.server start`
1) access MySQL with: `mysql -u root`
1) inside of MySQL run the following command to create the databases that this app uses: `create database sentiment; create database sentiment_test;`
1) Switch to each DB: `use sentiemnt;` and `use sentiment_test;` 
1) Add an initial search keyword to each DB: `insert into keyword(value, status, created_date) values('@allstate OR #allstate','active',SYSDATE());`
1) exit mysql CLI: `exit`

### Setup required to start app (after mysql is started)
1) Run migrations to create table and add test data to the DB: `yarn knex:migrate` and `NODE_ENV=test yarn knex:migrate`
1) Create a `.env` file and add a valid twitter bearer token for the `TWITTER_BEARER_TOKEN` env property

**Note**: If a proxy is required, ensure the `YARN_PROXY` env variable is set

### Commands:
**Note**: May need to give the `build:prod` script permissions to execute (`chmod +x ./build.sh`)
- Run locally in watch mode: `yarn local`
- Run all tests: `yarn test`
- Start server w/o watch mode: `yarn start`
- Build and package into a zip: `yarn build:prod`
- Create new knex migration: `yarn knex:create <MIGRATION_NAME>`
- Run knex migrations: `yarn knex:migrate`
- Run knex migrations for test DB: `NODE_ENV=test yarn knex:migrate`
- Rollback knex migrations: `yarn knex:rollback`
- Rollback knex migrations for test DB: `NODE_ENV=test yarn knex:rollback`

## Standards
- This project uses [semistandard](https://standardjs.com/) eslint setup
- `yarn test` runs the linter and all tests
- Husky pre-commit hook requires the `test` script to pass
- Run `yarn lint:fix` to fix lint issues