import config from '../knexfile';
import knex from 'knex';

export default class SentimentDbService {
  constructor () {
    this.db = knex(config[process.env.NODE_ENV || 'development']);
  }

    saveTweet = (analyzedTweet) => {
      if (analyzedTweet.text.length < 512) {
        return this.db('tweet').insert(analyzedTweet)
          .catch(error => {
            console.error('error saving tweet -->' + error.message);
          });
      }
    };

    getTweetsByDateRange = (startDate, endDate = new Date()) => {
      return this.db('tweet')
        .where('created_date', '>=', startDate)
        .where('created_date', '<=', endDate);
    };

    saveKeywords = (keywords) => {
      return this.db('keywords').insert({
        value: keywords,
        status: 'active',
        created_date: new Date()
      })
        .catch(error => {
          console.error('error saving keyword -->' + error.message);
        });
    };

    disableKeywords = (keywords) => {
      return this.db('keywords')
        .where('value', '=', keywords)
        .update('status', 'disabled');
    };

    getKeywordsByStatus = (status) => {
      return this.db('keywords')
        .where('status', status);
    };

    getAllKeywords = () => {
      return this.db('keywords');
    };
}
