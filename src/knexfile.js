require('dotenv').config({ path: '../.env' });

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      user: 'root',
      password: '',
      database: 'sentiment',
      timezone: 'UTC'
    }
  },
  test: {
    client: 'mysql',
    connection: {
      user: 'root',
      password: '',
      database: 'sentiment_test',
      timezone: 'UTC'
    }
  },
  production: {
    client: 'mssql',
    connection: {
      server: process.env.SENTIMENT_DB_SERVER,
      user: process.env.SENTIMENT_DB_USERNAME,
      password: process.env.SENTIMENT_DB_PASSWORD,
      database: 'sentiment',
      options: {
        port: 1433,
        encrypt: true // mandatory for microsoft azure sql server
      }
    }
  }
};
