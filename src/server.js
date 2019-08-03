import {} from 'dotenv/config';
import express from 'express';
import path from 'path';
import cron from 'node-cron';

import TwitterService from './services/TwitterService';
import DatabaseService from './services/DatabaseService';

const app = express();
const port = process.env.PORT || 5000;

const twitterService = new TwitterService();
// Check for new tweets every minute
cron.schedule('* * * * *', () => {
  twitterService.getNewTweets();
});

const databaseService = new DatabaseService();
app.get('/api/v1/posts', async (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const posts = await databaseService.getPostsByDateRange(startDate, endDate);
  res.send(posts);
});

app.get('/api/v1/keywords', async (req, res) => {
  const keywords = await databaseService.getAllKeywords();
  res.send(keywords);
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
