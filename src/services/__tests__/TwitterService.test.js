import TwitterService, { baseTwitterSearchUrl } from '../TwitterService';
import DatabaseService from '../DatabaseService';
const fetchMock = require('node-fetch');

describe('Service gets latest tweets on startup', () => {
  afterEach(() => {
    fetchMock.reset();
  });

  const defaultKeyword = { value: '#allstate OR @allstate', id: 1 };
  const defaultPost = { id: '1', keyword_id: defaultKeyword.id };
  const mockSearchResponse = {
    statuses: [
      {
        id: 123,
        id_str: '123',
        full_text: 'test tweet #allstate',
        created_at: '2019-07-09',
        entities: {
          urls: []
        }
      }
    ]
  };
  let mockGetKeywordsByStatus, mockGetLatestPostIdByKeywordId, mockSavePost;

  beforeEach(() => {
    mockGetKeywordsByStatus = jest.fn().mockImplementation(() => Promise.resolve([{
      value: defaultKeyword.value,
      id: defaultKeyword.id
    }]));
    mockGetLatestPostIdByKeywordId = jest.fn().mockImplementation((keywordId) => {
      return defaultKeyword.id === keywordId
        ? Promise.resolve(defaultPost.id)
        : Promise.resolve();
    });
    mockSavePost = jest.fn().mockImplementation(() =>
      Promise.resolve('Success'));

    DatabaseService.getKeywordsByStatus = mockGetKeywordsByStatus;
    DatabaseService.savePost = mockSavePost;
    DatabaseService.getLatestPostIdByKeywordId = mockGetLatestPostIdByKeywordId;
  });

  describe('full E2E flow', () => {
    it('new tweets are processed and sent to DB service to analyze sentiment and save', async () => {
      const twitterService = new TwitterService();
      fetchMock.mock(`glob:${baseTwitterSearchUrl}*${encodeURIComponent(defaultKeyword.value)}*retweets*quote*&lang=en&tweet_mode=extended*since_id=${defaultPost.id}`, {
        status: 200,
        headers: twitterService.fetchOptions.headers,
        body: mockSearchResponse
      });

      await twitterService.getNewTweets();

      const expectedPost = {
        id: mockSearchResponse.statuses[0].id_str,
        keyword_id: defaultKeyword.id,
        created_date: new Date(mockSearchResponse.statuses[0].created_at),
        type: 'TWITTER'
      };

      expect(mockGetKeywordsByStatus).toHaveBeenCalledTimes(1);
      expect(mockGetKeywordsByStatus).toHaveBeenCalledWith('active');
      expect(mockGetLatestPostIdByKeywordId).toHaveBeenCalledTimes(1);
      expect(mockGetLatestPostIdByKeywordId).toHaveBeenCalledWith(defaultKeyword.id);
      expect(mockSavePost).toHaveBeenCalledTimes(1);
      expect(mockSavePost).toHaveBeenCalledWith(expectedPost, mockSearchResponse.statuses[0].full_text);
    });

    it('if processed tweets contain a url they are not saved to DB to prevent an overflow of advertisement tweets', async () => {
      const twitterService = new TwitterService();
      fetchMock.mock(`glob:${baseTwitterSearchUrl}*${encodeURIComponent(defaultKeyword.value)}*retweets*quote*&lang=en&tweet_mode=extended*since_id=${defaultPost.id}`, {
        status: 200,
        headers: twitterService.fetchOptions.headers,
        body: {
          statuses: [
            {
              ...mockSearchResponse.statuses[0],
              entities: {
                urls: [{ url: 'https://fakeAd.com' }]
              }
            }
          ]
        }
      });

      await twitterService.getNewTweets();

      expect(mockGetKeywordsByStatus).toHaveBeenCalledTimes(1);
      expect(mockGetKeywordsByStatus).toHaveBeenCalledWith('active');
      expect(mockGetLatestPostIdByKeywordId).toHaveBeenCalledTimes(1);
      expect(mockGetLatestPostIdByKeywordId).toHaveBeenCalledWith(defaultKeyword.id);
      expect(mockSavePost).toHaveBeenCalledTimes(0);
    });
  });

  describe('getLatestTweetsByKeyword', () => {
    it('should include since_id in fetch call when a post exists for the provided keyword', async () => {
      const twitterService = new TwitterService();
      fetchMock.mock(`glob:${baseTwitterSearchUrl}*${encodeURIComponent(defaultKeyword.value)}*tweet_mode=extended&since_id=${defaultPost.id}`, {
        status: 200,
        headers: twitterService.fetchOptions.headers,
        body: mockSearchResponse
      });

      const tweets = await twitterService.getLatestTweetsByKeyword(defaultKeyword);

      expect(mockGetLatestPostIdByKeywordId).toHaveBeenCalledTimes(1);
      expect(mockGetLatestPostIdByKeywordId).toHaveBeenCalledWith(defaultKeyword.id);
      expect(tweets).toEqual(mockSearchResponse.statuses);
    });

    it('should not include since_id in fetch call when no posts exists for the provided keyword', async () => {
      const twitterService = new TwitterService();
      fetchMock.mock(`glob:${baseTwitterSearchUrl}*${encodeURIComponent(defaultKeyword.value)}*tweet_mode=extended`, {
        status: 200,
        headers: twitterService.fetchOptions.headers,
        body: mockSearchResponse
      });

      const badKeyword = {
        ...defaultKeyword,
        id: 100
      };

      const tweets = await twitterService.getLatestTweetsByKeyword(badKeyword);

      expect(mockGetLatestPostIdByKeywordId).toHaveBeenCalledTimes(1);
      expect(mockGetLatestPostIdByKeywordId).toHaveBeenCalledWith(badKeyword.id);
      expect(tweets).toEqual(mockSearchResponse.statuses);
    });

    it('should return empty array when no posts are found for the provided keyword', async () => {
      const twitterService = new TwitterService();
      fetchMock.mock(`glob:${baseTwitterSearchUrl}*${encodeURIComponent(defaultKeyword.value)}*tweet_mode=extended&since_id=${defaultPost.id}`, {
        status: 200,
        headers: twitterService.fetchOptions.headers,
        body: {}
      });
      const tweets = await twitterService.getLatestTweetsByKeyword(defaultKeyword);

      expect(mockGetLatestPostIdByKeywordId).toHaveBeenCalledTimes(1);
      expect(mockGetLatestPostIdByKeywordId).toHaveBeenCalledWith(defaultKeyword.id);
      expect(tweets).toEqual([]);
    });
  });

  describe('Fetch Options', () => {
    let yarnProxyHolder;
    beforeAll(() => { yarnProxyHolder = process.env.YARN_PROXY; });

    afterAll(() => { process.env.YARN_PROXY = yarnProxyHolder; });

    it('should return proxy agent when YARN_PROXY is set', () => {
      process.env.YARN_PROXY = 'http://proxy.com';
      const twitterService = new TwitterService();

      expect(twitterService.fetchOptions.agent).toBeTruthy();
    });

    it('should return undefined for proxy agent when YARN_PROXY is not set', () => {
      process.env.YARN_PROXY = '';
      const twitterService = new TwitterService();

      expect(twitterService.fetchOptions.agent).toBeUndefined();
    });
  });
});
