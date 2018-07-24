module.exports = {
    client: 'mysql',
    connection: {
      user: process.env.dbUser ||'root',
      password: process.env.dbPassword || '',
      database: 'sentiment_db'
    }
  };