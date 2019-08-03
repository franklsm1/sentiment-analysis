module.exports = {
  development: {
    client: 'mysql',
    connection: {
      user: process.env.sentimentDbUser || 'root',
      password: process.env.sentimentDbPassword || '',
      database: 'sentiment_db',
      timezone: 'UTC',
      charset: 'utf8mb4'
    }
  },
  test: {
    client: 'mysql',
    connection: {
      user: process.env.sentimentDbUser || 'root',
      password: process.env.sentimentDbPassword || '',
      database: 'sentiment_db_test',
      timezone: 'UTC',
      charset: 'utf8mb4'
    }
  }
};