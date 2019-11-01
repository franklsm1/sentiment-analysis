import app from '../app';
import DatabaseService from '../services/DatabaseService';
process.env.NODE_ENV = 'test';

const request = require('supertest');

describe('Endpoint routes', () => {
  const defaultTextToAnalyze = 'This is positive and good post text to be analyzed';
  const defaultPost = {
    id: '123',
    created_date: '2019-07-09',
    type: 'TWITTER'
  };

  beforeAll(async () => {
    await DatabaseService.db('post').del();
    await DatabaseService.db('keyword').del();
    const activeKeyword = await DatabaseService.saveKeyword('#allstate OR @allstate');
    const disabledKeywordText = 'I am disabled';
    await DatabaseService.saveKeyword(disabledKeywordText);
    await DatabaseService.disableKeyword(disabledKeywordText);
    defaultPost.keyword_id = activeKeyword[0];
    await DatabaseService.savePost(defaultPost, defaultTextToAnalyze);
  });

  afterAll(async () => {
    await DatabaseService.db.destroy();
  });

  it('should get Array of both keywords created in beforeAll when GET /api/v1/keywords endpoint is called', async () => {
    const response = await request(app)
      .get(`/api/v1/keywords`)
      .expect(200);

    expect(response.body).toHaveLength(2);
  });

  it('should get Array only active keyword created in beforeAll when GET /api/v1/keywords endpoint is called with status param', async () => {
    const response = await request(app)
      .get(`/api/v1/keywords?status=active`)
      .expect(200);

    expect(response.body).toHaveLength(1);
  });

  it('should get Array of all posts from start date param when GET /api/v1/posts endpoint is called', async () => {
    const response = await request(app)
      .get(`/api/v1/posts?startDate=${defaultPost.created_date}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
  });

  it('should return 400 when startDate param is missing when GET /api/v1/posts endpoint is called', async () => {
    await request(app)
      .get(`/api/v1/posts`)
      .expect(400);
  });

  it('should return 404 when invalid endpoint is called', async () => {
    await request(app)
      .get(`/api/v1/invalid`)
      .expect(404);
  });
});
