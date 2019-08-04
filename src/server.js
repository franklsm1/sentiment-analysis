import {} from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cron from 'node-cron';

import posts from './controllers/posts';
import keywords from './controllers/keywords';
import TwitterService from './services/TwitterService';

const app = express();
const port = process.env.PORT || 5000;
const baseApiEndpoint = '/api/v1';
const twitterService = new TwitterService();

// Check for new tweets every minute
cron.schedule('* * * * *', () => twitterService.getNewTweets());

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(baseApiEndpoint + '/posts', posts);
app.use(baseApiEndpoint + '/keywords', keywords);

app.use(express.static(path.join(__dirname, 'client')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
