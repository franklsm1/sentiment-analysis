import TwitterService, { baseTwitterSearchUrl, defaultFetchOptions } from '../TwitterService';
import SentimentDbService from '../SentimentDbService';
const fetchMock = require('node-fetch');

jest.mock('../SentimentDbService');

describe('Service gets latest tweets on startup', () => {
  afterEach(() => {
    fetchMock.reset();
  });

  it('new tweets are analyzed with a sentiment score and saved to the DB', async () => {
    const mockSearchResponse = {
      statuses: [
        {
          id: 123,
          id_str: '123',
          text: 'test tweet #allstate',
          created_at: new Date()
        }
      ]
    };
    const keywordId = 1;
    const keyword = '#allstate OR @allstate';
    const mockGetKeywordsByStatus = jest.fn().mockImplementation(() => Promise.resolve([
      {
        value: keyword,
        id: keywordId
      }
    ]));
    const mockGetLatestPostIdByKeyword = jest.fn().mockImplementation(() =>
      Promise.resolve(mockSearchResponse.id));
    const mockSavePost = jest.fn().mockImplementation(() =>
      Promise.resolve('Success'));

    SentimentDbService.mockImplementation(() => {
      return {
        getKeywordsByStatus: mockGetKeywordsByStatus,
        savePost: mockSavePost,
        getLatestPostIdByKeywordId: mockGetLatestPostIdByKeyword
      };
    });

    fetchMock.mock('begin:' + baseTwitterSearchUrl, {
      status: 200,
      headers: defaultFetchOptions.headers,
      body: mockSearchResponse
    });

    const twitterService = new TwitterService();
    await twitterService.getNewTweets();

    const expectedAnalyzedTweet = {
      id: mockSearchResponse.statuses[0].id_str,
      keyword_id: keywordId,
      sentiment: 0,
      created_date: mockSearchResponse.statuses[0].created_at,
      text: mockSearchResponse.statuses[0].text,
      type: 'TWITTER'
    };

    expect(mockGetKeywordsByStatus).toHaveBeenCalledTimes(1);
    expect(mockGetKeywordsByStatus).toHaveBeenCalledWith('active');
    expect(mockGetLatestPostIdByKeyword).toHaveBeenCalledTimes(1);
    expect(mockGetLatestPostIdByKeyword).toHaveBeenCalledWith(keywordId);
    expect(mockSavePost).toHaveBeenCalledTimes(1);
    expect(mockSavePost).toHaveBeenCalledWith(expectedAnalyzedTweet);
  });
});
