import SentimentDbService from '../SentimentDbService';

describe('Sentiment DB Service', () => {
  let sentimentDbService;
  const date = new Date();
  const testPostToSave = {
    id: '123',
    sentiment: -5,
    created_date: date,
    type: 'TWITTER'
  };

  beforeAll(() => {
    sentimentDbService = new SentimentDbService();
  });

  beforeEach(async () => {
    await sentimentDbService.db('post').del();
    await sentimentDbService.db('keyword').del();
  });

  afterAll(() => {
    sentimentDbService.db.destroy();
  });

  describe('posts', () => {
    beforeEach(async () => {
      const savedInitialKeywordIds = await sentimentDbService.saveKeyword('initial keyword');
      testPostToSave.keyword_id = savedInitialKeywordIds[0];
    });

    it('savePost saves a valid analyzed post object to the DB', async () => {
      await sentimentDbService.savePost(testPostToSave);
      const postsInDb = await sentimentDbService.getPostsByDateRange('1995-12-17', '2095-12-17');

      expect(postsInDb).toHaveLength(1);
      expect(postsInDb[0].id).toEqual(testPostToSave.id);
      expect(postsInDb[0].text).toEqual(testPostToSave.text);
    });

    it('attempt to save duplicate post does not save duplicate', async () => {
      await sentimentDbService.savePost(testPostToSave);
      await sentimentDbService.savePost(testPostToSave);
      const postsInDb = await sentimentDbService.getPostsByDateRange('1995-12-17', '2095-12-17');

      expect(postsInDb).toHaveLength(1);
    });

    it('getPostsByDateRange defaults to current date for endDate if none is passed in', async () => {
      const testPostHardCodedDate = {
        ...testPostToSave,
        created_date: '2019-7-25'
      };
      await sentimentDbService.savePost(testPostHardCodedDate);
      const postsInDb = await sentimentDbService.getPostsByDateRange('2019-7-25');

      expect(postsInDb).toHaveLength(1);
      expect(postsInDb[0].id).toEqual(testPostToSave.id);
      expect(postsInDb[0].text).toEqual(testPostToSave.text);
    });

    it('getPostsByDateRange returns empty list if no posts in date range', async () => {
      const testPostHardCodedDate = {
        ...testPostToSave,
        created_date: '2019-7-24'
      };
      await sentimentDbService.savePost(testPostHardCodedDate);
      const postsInDb = await sentimentDbService.getPostsByDateRange('2019-7-25');

      expect(postsInDb).toHaveLength(0);
    });

    it('getLatestPostIdByKeywordId returns most recent post id when one exists', async () => {
      const testPostHardCodedDate = {
        ...testPostToSave,
        created_date: '2019-7-24'
      };
      const newestPostId = testPostHardCodedDate.id;
      await sentimentDbService.savePost(testPostHardCodedDate);

      testPostHardCodedDate.created_date = '2019-7-23';
      testPostHardCodedDate.id = '1234';
      await sentimentDbService.savePost(testPostHardCodedDate);

      testPostHardCodedDate.created_date = '2019-7-22';
      testPostHardCodedDate.id = '12345';
      await sentimentDbService.savePost(testPostHardCodedDate);

      const actualLatestPostId = await sentimentDbService.getLatestPostIdByKeywordId(testPostToSave.keyword_id);

      expect(actualLatestPostId).toBe(newestPostId);
    });

    it('getLatestPostIdByKeywordId returns undefined when none exist', async () => {
      const actualLatestPostId = await sentimentDbService.getLatestPostIdByKeywordId(testPostToSave.keyword_id);

      expect(actualLatestPostId).toBeUndefined();
    });
  });

  describe('keywords', () => {
    it('attempt to save new keyword saves properly', async () => {
      const keyword = '@test OR #test';
      await sentimentDbService.saveKeyword(keyword);

      const allKeywords = await sentimentDbService.getAllKeywords();

      expect(allKeywords).toHaveLength(1);
      expect(allKeywords[0].value).toBe(keyword);
    });

    it('attempt to save duplicate keyword does not save duplicate', async () => {
      await sentimentDbService.saveKeyword('@test OR #test');
      await sentimentDbService.saveKeyword('@test OR #test');
      const allKeywords = await sentimentDbService.getAllKeywords();

      expect(allKeywords).toHaveLength(1);
    });

    it('attempt to get only active keywords after saving three keywords and disabling one returns only two keywords', async () => {
      await sentimentDbService.saveKeyword('@test OR #test');
      await sentimentDbService.saveKeyword('@test2 OR #test2');
      await sentimentDbService.saveKeyword('@test3 OR #test3');
      await sentimentDbService.disableKeyword('@test OR #test');
      const activeKeywords = await sentimentDbService.getKeywordsByStatus('active');

      expect(activeKeywords).toHaveLength(2);
      expect(activeKeywords[0].value).toEqual('@test2 OR #test2');
      expect(activeKeywords[1].value).toEqual('@test3 OR #test3');
    });

    it('attempt to get all keywords after saving three keywords and disabling one returns three keywords', async () => {
      await sentimentDbService.saveKeyword('@test OR #test');
      await sentimentDbService.saveKeyword('@test2 OR #test2');
      await sentimentDbService.saveKeyword('@test3 OR #test3');
      await sentimentDbService.disableKeyword('@test OR #test');
      const activeKeywords = await sentimentDbService.getAllKeywords();

      expect(activeKeywords).toHaveLength(3);
      expect(activeKeywords[0].value).toEqual('@test OR #test');
      expect(activeKeywords[1].value).toEqual('@test2 OR #test2');
      expect(activeKeywords[2].value).toEqual('@test3 OR #test3');
    });
  });
});
