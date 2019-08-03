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
  agent: process.env.NETWORK_ENV === 'PROXY' ? new HttpsProxyAgent('http://webproxy.igslb.allstate.com:8080/') : ''
};

export default class TwitterService {
  constructor () {
    this.sentimentDbService = new SentimentDbService();
    return this.startUp();
  }

    startUp = async () => {
      const keywordsList = await this.sentimentDbService.getKeywordsByStatus('active');
      await Promise.all(keywordsList.map(async (keywords) => {
        const tweets = await this.getTweetsByKeywordsAndDate(keywords.value);
        tweets.forEach((tweet) => this.saveTweet(keywords.value, tweet));
      }));
    };

    saveTweet = (keywords, tweet) => {
      console.log('tweet:', tweet.text);
      const tweetObject = this.analyzeTweet(tweet);
      tweetObject.keywords = keywords;
      this.sentimentDbService.saveTweet(tweetObject);
    };

    analyzeTweet = (tweet) => {
      const sentimentAnalysis = sentiment.analyze(tweet.text);
      return {
        id: tweet.id_str,
        sentiment: sentimentAnalysis.score,
        created_date: new Date(tweet.created_at),
        text: tweet.text
      };
    };

    getTweetsByKeywordsAndDate = async (keywords, dateSince = new Date()) => {
      const dateSinceFormatted = `${dateSince.getFullYear()}-${dateSince.getMonth() + 1}-${dateSince.getDate()}`;
      const queryParam = `${keywords} -filter:retweets since:${dateSinceFormatted}`;
      console.log('URIComponent(queryParam): ', queryParam);

      const response = await fetch(`${baseTwitterSearchUrl}?q=${encodeURIComponent(queryParam)}&include_entities=0&lang=en`, defaultFetchOptions);
      const responseJson = await response.json();
      return responseJson.statuses;
    }
}
