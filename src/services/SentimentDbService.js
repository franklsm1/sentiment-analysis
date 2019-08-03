import config from '../knexfile';
import knex from 'knex';

export default class SentimentDbService {
  constructor () {
    this.db = knex(config[process.env.NODE_ENV || 'development']);
  }

  savePost = (post) => {
    if (post.text.length < 512) {
      return this.db('post').insert(post)
        .catch(error => {
          console.error(`error saving post with type: ${post.type} -->` + error.message);
        });
    }
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
}
