module.exports = {
  development: {
    client: 'mysql',
    connection: {
      user: process.env.dbUser || 'root',
      password: process.env.dbPassword || '',
      database: 'sentiment_db',
      timezone: 'UTC',
      charset: 'utf8mb4'
    }
  },
  test: {
    client: 'mysql',
    connection: {
      user: process.env.dbUser || 'root',
      password: process.env.dbPassword || '',
      database: 'sentiment_db_test',
      timezone: 'UTC',
      charset: 'utf8mb4'
    }
  }
};