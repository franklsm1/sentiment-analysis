module.exports = {
  development: {
    client: 'mysql',
    connection: {
      user: process.env.sentimentDbUser || 'root',
      password: process.env.sentimentDbPassword || '',
      database: 'sentiment',
      timezone: 'UTC'
    }
  },
  test: {
    client: 'mysql',
    connection: {
      user: process.env.sentimentDbUser || 'root',
      password: process.env.sentimentDbPassword || '',
      database: 'sentiment_test',
      timezone: 'UTC'
    }
  }
};
