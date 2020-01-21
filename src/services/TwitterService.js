import HttpsProxyAgent from 'https-proxy-agent';
import DatabaseService from './DatabaseService';
const fetch = require('node-fetch');

export const baseTwitterSearchUrl = 'https://api.twitter.com/1.1/search/tweets.json';

export default class TwitterService {
  get fetchOptions () {
    return {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`

      },
      agent: process.env.YARN_PROXY ? new HttpsProxyAgent(process.env.YARN_PROXY) : undefined
    };
  }

  getNewTweets = async () => {
    const keywordList = await DatabaseService.getKeywordsByStatus('active');
    await Promise.all(keywordList.map(async (keyword) => {
      const tweets = await this.getLatestTweetsByKeyword(keyword);
      tweets.forEach((tweet) => this.saveTweet(keyword, tweet));
    }));
  };

  saveTweet = (keyword, tweet) => {
    const postObject = {
      id: tweet.id_str,
      created_date: new Date(tweet.created_at),
      type: 'TWITTER',
      keyword_id: keyword.id
    };
    console.log(`sentiment: ${postObject.sentiment} tweet: ${tweet.full_text}`);
    DatabaseService.savePost(postObject, tweet.full_text);
  };

  getLatestTweetsByKeyword = async (keyword) => {
    const latestPostId = await DatabaseService.getLatestPostIdByKeywordId(keyword.id);
    const queryParam = `${keyword.value} -filter:retweets -filter:quote -filter:replies`;
    const sinceIdParam = latestPostId ? `&since_id=${latestPostId}` : '';
    const searchURL = `${baseTwitterSearchUrl}?q=${encodeURIComponent(queryParam)}&include_entities=0&lang=en&tweet_mode=extended${sinceIdParam}`;
    console.log('URL: ', searchURL);

    const response = await fetch(searchURL, this.fetchOptions);
    const responseJson = await response.json();
    return responseJson.statuses || [];
  };
}
