# React, Express, and MySQL App to track sentiment Analysis

### Setup MySQL locally
1) install brew (if not installed): `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
1) install MySQL (on a mac) with: `brew install mysql`
1) start MySQL with: `mysql.server start`
1) access MySQL with: `mysql -u root`
1) inside of MySQL run the following command to create the databases that this app uses: `create database sentiment; create database sentiment_test;`
1) exit mysql CLI: `exit`

### Setup required to start app (after mysql is started)
1) install yarn (if not installed): `brew install yarn`
1) install project: `yarn install`
1) install project in client dir: `cd client && yarn install`
1) Run migrations to create table and add test data to the DB: `yarn knex:migrate` and `NODE_ENV=test yarn knex:migrate`
    - If fail due to "Client does not support authentication protocol requested by server; consider upgrading MySQL client", then run following in mysql: 
    - `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';`
    - `flush privileges;`
1) In both `.env` files (main and client directories), add a valid twitter bearer token for the `TWITTER_BEARER_TOKEN` 

**Note**: If a proxy is required, ensure the `YARN_PROXY` env variable is set
**Note2**: If you keep getting self signed cert in chain run the followinng command `export NODE_TLS_REJECT_UNAUTHORIZED="0"`

### Commands:
**Note**: May need to give the `build:prod` script permissions to execute (`chmod +x ./build.sh`)
- Run locally in watch mode: `yarn local`
- Run all tests: `yarn test`
- Start server: `yarn start`
- Start server w/ watch mode: `yarn start:watch`
- Build and package into a zip: `yarn build:prod`
- Create new knex migration: `yarn knex:create <MIGRATION_NAME>`
- Run knex migrations: `yarn knex:migrate`
- Run knex migrations for test DB: `NODE_ENV=test yarn knex:migrate`
- Rollback knex migrations: `yarn knex:rollback`
- Rollback knex migrations for test DB: `NODE_ENV=test yarn knex:rollback`

### Run MSSQL on Azure
- Set `SENTIMENT_DB_SERVER`, `SENTIMENT_DB_USERNAME`, and `SENTIMENT_DB_PASSWORD` env vars
- Run knex migrations for Azure MSSQL DB: `NODE_ENV=production yarn knex:migrate`
- Start server: `yarn start:prod`

## Standards
- This project uses [semistandard](https://standardjs.com/) eslint setup
- `yarn test` runs the linter and all tests
- Husky pre-commit hook requires the `test` script to pass
- Run `yarn lint:fix` to fix lint issues
