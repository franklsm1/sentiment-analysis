import SentimentDbService from '../SentimentDbService';

describe('Sentiment DB Service', () => {
  let sentimentDbService;
  const date = new Date();
  const testTweetToSave = {
    id: '123',
    sentiment: -5,
    created_date: date,
    text: 'fake negative tweet text',
    keywords: 'test'
  };

  beforeAll(() => {
    sentimentDbService = new SentimentDbService();
  });

  beforeEach(async () => {
    await sentimentDbService.db('tweet').del();
    await sentimentDbService.db('keywords').del();
  });

  it('saveTweet saves a valid analyzed tweet object to the DB', async () => {
    await sentimentDbService.saveTweet(testTweetToSave);
    const tweetsInDb = await sentimentDbService.getTweetsByDateRange(new Date('1995-12-17'), new Date('2095-12-17'));

    expect(tweetsInDb).toHaveLength(1);
    expect(tweetsInDb[0].id).toEqual(testTweetToSave.id);
    expect(tweetsInDb[0].text).toEqual(testTweetToSave.text);
  });

  it('saveTweet with text longer then 512 characters does not save', async () => {
    const longTestToSave = {
      ...testTweetToSave,
      text: 'dslljdflkasjdlfkjslkdfjsldfjlksdjfslkdjflksdjflksdjflksdjfksldjflksdjflksjdflksjdflkfjsldfkjsd' +
                    'jhflksjdhfdslljdflkasjdlfkjslkdfjsldfjlksdjfslkdjflksdjflksdjflksdjfksldjflksdjflksjdflksjdflkfj' +
                    'sldfkjsdjhflksjdhfdslljdflkasjdlfkjslkdfjsldfjlksdjfslkdjflksdjflksdjflksdjfksldjflksdjflksjdflk' +
                    'sjdflkfjsldfkjsdjhflksjdhfdslljdflkasjdlfkjslkdfjsldfjlksdjfslkdjflksdjflksdjflksdjfksldjflksdjf' +
                    'lksjdflksjdflkfjsldfkjsdjhflksjdhfdslljdflkasjdlfkjslkdfjsldfjlksdjfslkdjflksdjflksdjflksdjfksld' +
                    'jflksdjflksjdflksjdflkfjsldfkjsdjhflksjdhf'
    };

    await sentimentDbService.saveTweet(longTestToSave);
    const tweetsInDb = await sentimentDbService.getTweetsByDateRange(new Date('1995-12-17'), new Date('2095-12-17'));

    expect(tweetsInDb).toHaveLength(0);
  });

  it('attempt to save duplicate tweet does not save duplicate', async () => {
    await sentimentDbService.saveTweet(testTweetToSave);
    await sentimentDbService.saveTweet(testTweetToSave);
    const tweetsInDb = await sentimentDbService.getTweetsByDateRange(new Date('1995-12-17'), new Date('2095-12-17'));

    expect(tweetsInDb).toHaveLength(1);
  });

  it('getTweetsByDateRange defaults to current date for endDate if none is passed in', async () => {
    const testTweetHardCodedDate = {
      ...testTweetToSave,
      created_date: new Date('2019-7-25')
    };
    await sentimentDbService.saveTweet(testTweetHardCodedDate);
    const tweetsInDb = await sentimentDbService.getTweetsByDateRange(new Date('2019-7-25'));

    expect(tweetsInDb).toHaveLength(1);
    expect(tweetsInDb[0].id).toEqual(testTweetToSave.id);
    expect(tweetsInDb[0].text).toEqual(testTweetToSave.text);
  });

  it('getTweetsByDateRange returns empty list if no tweets in date range', async () => {
    const testTweetHardCodedDate = {
      ...testTweetToSave,
      created_date: new Date('2019-7-24')
    };
    await sentimentDbService.saveTweet(testTweetHardCodedDate);
    const tweetsInDb = await sentimentDbService.getTweetsByDateRange(new Date('2019-7-25'));

    expect(tweetsInDb).toHaveLength(0);
  });

  it('attempt to save new keyword saves properly', async () => {
    const keywords = '@test OR #test';
    await sentimentDbService.saveKeywords(keywords);

    const allKeywords = await sentimentDbService.getAllKeywords();

    expect(allKeywords).toHaveLength(1);
    expect(allKeywords[0].value).toBe(keywords);
  });

  it('attempt to save duplicate keyword does not save duplicate', async () => {
    await sentimentDbService.saveKeywords('@test OR #test');
    await sentimentDbService.saveKeywords('@test OR #test');
    const allKeywords = await sentimentDbService.getAllKeywords();

    expect(allKeywords).toHaveLength(1);
  });

  it('attempt to get only active keywords after saving three keywords and disabling one returns only two keywords', async () => {
    await sentimentDbService.saveKeywords('@test OR #test');
    await sentimentDbService.saveKeywords('@test2 OR #test2');
    await sentimentDbService.saveKeywords('@test3 OR #test3');
    await sentimentDbService.disableKeywords('@test OR #test');
    const activeKeywords = await sentimentDbService.getKeywordsByStatus('active');

    expect(activeKeywords).toHaveLength(2);
    expect(activeKeywords[0].value).toEqual('@test2 OR #test2');
    expect(activeKeywords[1].value).toEqual('@test3 OR #test3');
  });

  it('attempt to get all keywords after saving three keywords and disabling one returns three keywords', async () => {
    await sentimentDbService.saveKeywords('@test OR #test');
    await sentimentDbService.saveKeywords('@test2 OR #test2');
    await sentimentDbService.saveKeywords('@test3 OR #test3');
    await sentimentDbService.disableKeywords('@test OR #test');
    const activeKeywords = await sentimentDbService.getAllKeywords();

    expect(activeKeywords).toHaveLength(3);
    expect(activeKeywords[0].value).toEqual('@test OR #test');
    expect(activeKeywords[1].value).toEqual('@test2 OR #test2');
    expect(activeKeywords[2].value).toEqual('@test3 OR #test3');
  });
});
