import {} from 'dotenv/config';
import cron from 'node-cron';
import path from 'path';

import app from './app';
import TwitterService from './services/TwitterService';
import express from 'express';

const twitterService = new TwitterService();

// Check for new tweets every minute
cron.schedule('* * * * *', () => twitterService.getNewTweets());
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
