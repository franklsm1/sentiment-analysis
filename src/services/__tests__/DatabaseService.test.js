import DatabaseService from '../DatabaseService';
import * as SentimentService from '../SentimentService';

describe('DB config', () => {
  const holder = process.env.NODE_ENV;
  let databaseService;
  afterAll(() => { process.env.NODE_ENV = holder; });

  afterEach(() => databaseService.db.destroy());

  it('should use development by default if no NODE_ENV', () => {
    process.env.NODE_ENV = '';
    databaseService = new DatabaseService();

    expect(databaseService.db.client.connectionSettings.database).toEqual('sentiment');
  });

  it('should use test if NODE_ENV is set to test', () => {
    process.env.NODE_ENV = 'test';
    databaseService = new DatabaseService();

    expect(databaseService.db.client.connectionSettings.database).toEqual('sentiment_test');
  });
});

describe('Sentiment DB Service', () => {
  const databaseService = new DatabaseService();
  const defaultTextToAnalyze = 'This is positive and good post text to be analyzed';
  const defaultSentimentScore = SentimentService.analyze(defaultTextToAnalyze); // 5
  const defaultPost = {
    id: '123',
    created_date: '2019-07-09',
    type: 'TWITTER'
  };

  beforeEach(async () => {
    await databaseService.db('post').del();
    await databaseService.db('keyword').del();
  });

  afterAll(() => {
    databaseService.db.destroy();
  });

  describe('posts', () => {
    beforeEach(async () => {
      const savedInitialKeywordIds = await databaseService.saveKeyword('initial keyword');
      defaultPost.keyword_id = savedInitialKeywordIds[0];
    });

    it('savePost saves a valid analyzed post object to the DB', async () => {
      await databaseService.savePost(defaultPost, defaultTextToAnalyze);
      const postsInDb = await databaseService.getPostsByDateRange('1995-12-17', '2095-12-17');

      expect(postsInDb).toHaveLength(1);
      expect(postsInDb[0].id).toEqual(defaultPost.id);
      expect(postsInDb[0].sentiment).toEqual(defaultSentimentScore);
    });

    it('attempt to save duplicate post does not save duplicate', async () => {
      await databaseService.savePost(defaultPost, defaultTextToAnalyze);
      await databaseService.savePost(defaultPost, defaultTextToAnalyze);
      const postsInDb = await databaseService.getPostsByDateRange('1995-12-17', '2095-12-17');

      expect(postsInDb).toHaveLength(1);
    });

    it('getPostsByDateRange defaults to current date for endDate if none is passed in', async () => {
      const testPostHardCodedDate = {
        ...defaultPost,
        created_date: '2019-7-25'
      };
      await databaseService.savePost(testPostHardCodedDate, defaultTextToAnalyze);
      const postsInDb = await databaseService.getPostsByDateRange('2019-7-25');

      expect(postsInDb).toHaveLength(1);
      expect(postsInDb[0].id).toEqual(defaultPost.id);
      expect(postsInDb[0].sentiment).toEqual(defaultSentimentScore);
    });

    it('getPostsByDateRange returns empty list if no posts in date range', async () => {
      const testPostHardCodedDate = {
        ...defaultPost,
        created_date: '2019-7-24'
      };
      await databaseService.savePost(testPostHardCodedDate, defaultTextToAnalyze);
      const postsInDb = await databaseService.getPostsByDateRange('2019-7-25');

      expect(postsInDb).toHaveLength(0);
    });

    it('getLatestPostIdByKeywordId returns most recent post id when one exists', async () => {
      const testPostHardCodedDate = {
        ...defaultPost,
        created_date: '2019-7-24'
      };
      const newestPostId = testPostHardCodedDate.id;
      await databaseService.savePost(testPostHardCodedDate, defaultTextToAnalyze);

      testPostHardCodedDate.created_date = '2019-7-23';
      testPostHardCodedDate.id = '1234';
      await databaseService.savePost(testPostHardCodedDate, defaultTextToAnalyze);

      testPostHardCodedDate.created_date = '2019-7-22';
      testPostHardCodedDate.id = '12345';
      await databaseService.savePost(testPostHardCodedDate, defaultTextToAnalyze);

      const actualLatestPostId = await databaseService.getLatestPostIdByKeywordId(defaultPost.keyword_id);

      expect(actualLatestPostId).toBe(newestPostId);
    });

    it('getLatestPostIdByKeywordId returns undefined when none exist', async () => {
      const actualLatestPostId = await databaseService.getLatestPostIdByKeywordId(defaultPost.keyword_id);

      expect(actualLatestPostId).toBeUndefined();
    });
  });

  describe('keywords', () => {
    it('attempt to save new keyword saves properly', async () => {
      const keyword = '@test OR #test';
      await databaseService.saveKeyword(keyword);

      const allKeywords = await databaseService.getAllKeywords();

      expect(allKeywords).toHaveLength(1);
      expect(allKeywords[0].value).toBe(keyword);
    });

    it('attempt to save duplicate keyword does not save duplicate', async () => {
      await databaseService.saveKeyword('@test OR #test');
      await databaseService.saveKeyword('@test OR #test');
      const allKeywords = await databaseService.getAllKeywords();

      expect(allKeywords).toHaveLength(1);
    });

    it('attempt to get only active keywords after saving three keywords and disabling one returns only two keywords', async () => {
      await databaseService.saveKeyword('@test OR #test');
      await databaseService.saveKeyword('@test2 OR #test2');
      await databaseService.saveKeyword('@test3 OR #test3');
      await databaseService.disableKeyword('@test OR #test');
      const activeKeywords = await databaseService.getKeywordsByStatus('active');

      expect(activeKeywords).toHaveLength(2);
      expect(activeKeywords[0].value).toEqual('@test2 OR #test2');
      expect(activeKeywords[1].value).toEqual('@test3 OR #test3');
    });

    it('attempt to get all keywords after saving three keywords and disabling one returns three keywords', async () => {
      await databaseService.saveKeyword('@test OR #test');
      await databaseService.saveKeyword('@test2 OR #test2');
      await databaseService.saveKeyword('@test3 OR #test3');
      await databaseService.disableKeyword('@test OR #test');
      const activeKeywords = await databaseService.getAllKeywords();

      expect(activeKeywords).toHaveLength(3);
      expect(activeKeywords[0].value).toEqual('@test OR #test');
      expect(activeKeywords[1].value).toEqual('@test2 OR #test2');
      expect(activeKeywords[2].value).toEqual('@test3 OR #test3');
    });
  });
});
