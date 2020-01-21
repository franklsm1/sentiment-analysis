import knex from 'knex';

import config from '../knexfile';
import * as SentimentService from './SentimentService';

export class DatabaseService {
  constructor () {
    this.db = knex(config[process.env.NODE_ENV || 'development']);
  }

  savePost = (post, text) => {
    post.sentiment = SentimentService.analyze(text);
    console.log(`sentiment: ${post.sentiment} text: ${text}`);
    return this.db('post').insert(post)
      .catch(error => {
        console.error(`error saving post with type: ${post.type} -->` + error.message);
      });
  };

  getPostsByDateRange = (startDate, endDate = new Date()) => {
    return this.db('post')
      .where('created_date', '>=', startDate)
      .where('created_date', '<=', endDate);
  };

  saveKeyword = (keyword) => {
    return this.db('keyword').insert({
      value: keyword,
      status: 'active',
      created_date: new Date()
    })
      .catch(error => {
        console.error(`error saving keyword: ${keyword} -->` + error.message);
      });
  };

  disableKeyword = (keyword) => {
    return this.db('keyword')
      .where('value', '=', keyword)
      .update('status', 'disabled');
  };

  getKeywordsByStatus = (status) => {
    return this.db('keyword')
      .where('status', status);
  };

  getAllKeywords = () => {
    return this.db('keyword');
  };

  getLatestPostIdByKeywordId = async (keywordId) => {
    try {
      const latestCreatedDates = await this.db('post')
        .max({ latestCreatedDate: 'created_date' })
        .where('keyword_id', '=', keywordId)
        .groupBy('keyword_id');

      if (latestCreatedDates.length > 0) {
        const latestPostIds = await this.db('post')
          .select('id')
          .where('created_date', '=', latestCreatedDates[0]['latestCreatedDate']);
        return latestPostIds[0].id;
      }
    } catch (error) {
      console.error(`error getting latest post id for keyword: ${keywordId} -->` + error.message);
    }
  }
}

export default new DatabaseService();
