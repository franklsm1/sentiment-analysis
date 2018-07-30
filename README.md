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
TWITTER_CONSUMER_KEY=xxxxx
TWITTER_CONSUMER_SECRET=xxxxx
TWITTER_ACCESS_TOKEN_KEY=xxxxx
TWITTER_ACCESS_TOKEN_SECRET=xxxxx
```

### Commands:
- Run locally in watch mode: `yarn local`
- Run all tests: `yarn test`
- Start server w/o watch mode: `yarn start`
- Build and package into a zip: `yarn build-zip`
- Rollback knex migrations: `yarn rollback`

**Note**: May need to give build-zip script permissions to execute (`chmod +x ./build.sh`)

