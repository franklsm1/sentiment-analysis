import Sentiment from 'sentiment';
import HttpsProxyAgent from 'https-proxy-agent';
import SentimentDbService from './SentimentDbService';
const fetch = require('node-fetch');
const sentiment = new Sentiment();
export const baseTwitterSearchUrl = 'https://api.twitter.com/1.1/search/tweets.json';
export const defaultFetchOptions = {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`

  },
  agent: process.env.YARN_PROXY ? new HttpsProxyAgent(process.env.YARN_PROXY) : ''
};

export default class TwitterService {
  constructor () {
    this.sentimentDbService = new SentimentDbService();
  }

  getNewTweets = async () => {
    const keywordList = await this.sentimentDbService.getKeywordsByStatus('active');
    await Promise.all(keywordList.map(async (keyword) => {
      const tweets = await this.getTweetsByKeywordAndDate(keyword);
      tweets.forEach((tweet) => this.saveTweet(keyword, tweet));
    }));
  };

  saveTweet = (keyword, tweet) => {
    console.log('tweet:', tweet.full_text);
    const postObject = this.analyzeTweet(tweet);
    postObject.keyword_id = keyword.id;
    this.sentimentDbService.savePost(postObject);
  };

  analyzeTweet = (tweet) => {
    const sentimentAnalysis = sentiment.analyze(tweet.full_text);
    return {
      id: tweet.id_str,
      sentiment: sentimentAnalysis.score,
      created_date: new Date(tweet.created_at),
      text: tweet.full_text,
      type: 'TWITTER'
    };
  };

  getTweetsByKeywordAndDate = async (keyword, dateSince = new Date()) => {
    const latestPostId = await this.sentimentDbService.getLatestPostIdByKeywordId(keyword.id);
    const dateSinceFormatted = `${dateSince.getFullYear()}-${dateSince.getMonth() + 1}-${dateSince.getDate()}`;
    const queryParam = `${keyword.value} -filter:retweets -filter:quote since:${dateSinceFormatted}`;
    const sinceIdParam = latestPostId ? `&since_id=${latestPostId}` : '';
    const searchURL = `${baseTwitterSearchUrl}?q=${encodeURIComponent(queryParam)}&include_entities=0&lang=en&tweet_mode=extended${sinceIdParam}`;
    console.log('URL: ', searchURL);

    const response = await fetch(searchURL, defaultFetchOptions);
    const responseJson = await response.json();
    return responseJson.statuses;
  };
}
