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
    return this.startUp();
  }

  startUp = async () => {
    const keywordList = await this.sentimentDbService.getKeywordsByStatus('active');
    await Promise.all(keywordList.map(async (keyword) => {
      const tweets = await this.getTweetsByKeywordAndDate(keyword.value);
      tweets.forEach((tweet) => this.saveTweet(keyword.value, tweet));
    }));
  };

  saveTweet = (keyword, tweet) => {
    console.log('tweet:', tweet.text);
    const postObject = this.analyzeTweet(tweet);
    postObject.keyword = keyword;
    this.sentimentDbService.savePost(postObject);
  };

  analyzeTweet = (tweet) => {
    const sentimentAnalysis = sentiment.analyze(tweet.text);
    return {
      id: tweet.id_str,
      sentiment: sentimentAnalysis.score,
      created_date: new Date(tweet.created_at),
      text: tweet.text,
      type: 'TWITTER'
    };
  };

  getTweetsByKeywordAndDate = async (keywords, dateSince = new Date()) => {
    const dateSinceFormatted = `${dateSince.getFullYear()}-${dateSince.getMonth() + 1}-${dateSince.getDate()}`;
    const queryParam = `${keywords} -filter:retweets since:${dateSinceFormatted}`;
    console.log('URIComponent(queryParam): ', queryParam);

    const response = await fetch(`${baseTwitterSearchUrl}?q=${encodeURIComponent(queryParam)}&include_entities=0&lang=en`, defaultFetchOptions);
    const responseJson = await response.json();
    return responseJson.statuses;
  }
}
