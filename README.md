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
1) install server and client packages: `yarn installBoth`
1) Run migrations to create table and add test data to the DB: `yarn knex:migrate` and `NODE_ENV=test yarn knex:migrate`
    - If fail due to "Client does not support authentication protocol requested by server; consider upgrading MySQL client", then run following in mysql: 
    - `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';`
    - `flush privileges;`
1) Create a `.env` file at the top level and add the `TWITTER_BEARER_TOKEN` prop with a valid twitter bearer token 

**Note**: If a proxy is required, ensure the `YARN_PROXY` env variable is set
**Note2**: If you keep getting self signed cert in chain run the followinng command `export NODE_TLS_REJECT_UNAUTHORIZED="0"`

### CLI Commands:
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

### Steps to run container locally (assuming docker is installed)
1. Build the container
    - `docker build -t sentiment-analysis .`
1. export `SENTIMENT_DB_SERVER`, `SENTIMENT_DB_USERNAME`, and `SENTIMENT_DB_PASSWORD` env vars locally
1. Run the container
    - `docker run --privileged -p 8088:443 --env SENTIMENT_DB_SERVER --env SENTIMENT_DB_USERNAME --env SENTIMENT_DB_PASSWORD --name sentiment-analysis -d sentiment-analysis`
1. Visit http://localhost:8088 to view the app

##### Helpful Docker commands:
- SSH into container: `docker exec -it sentiment-analysis bash`
- Stop container: `docker stop sentiment-analysis`
- Remove container: `docker rm sentiment-analysis`
- View container logs: `docker logs sentiment-analysis`
- Remove dangling images: `docker image prune`

## Standards
- This project uses [semistandard](https://standardjs.com/) eslint setup
- `yarn test` runs the linter and all tests
- Husky pre-commit hook requires the `test` script to pass
- Run `yarn lint:fix` to fix lint issues
