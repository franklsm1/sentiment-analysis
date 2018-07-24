# React and Express Combined App

### Setup MySQL locally
1) install MySQL (on a mac) with: `brew install mysql`
1) start MySQL with: `mysql.server start`
1) access MySQL with: `mysql -u root`
1) inside of MySQL run the following command to create the databases that this app uses:
- `create database sentiment_db;`
1) exit mysql CLI: `exit`
1) run migration to create table and add test data to the DB: `yarn migrate`


### Commands:
- Run locally: `yarn dev`
- Build and package app into a zip: `yarn build-zip`
- Rollback knex migrations: `yarn rollback`

**Note**: May need to give build-zip script permissions to execute (`chmod +x ./build.sh`)

