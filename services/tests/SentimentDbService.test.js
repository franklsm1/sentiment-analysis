import SentimentDbService from "../SentimentDbService";

describe("Sentiment DB Service", () => {
    let sentimentDbService;
    let testTweetToSave = {
        id: "123",
        sentiment: -5,
        created_date: new Date(),
        text: "fake negative tweet text",
        keywords: "test"
    };

    beforeAll(() => {
        sentimentDbService = new SentimentDbService();
    });

    beforeEach((done) => {
        sentimentDbService.db('tweet').del()
            .then(() => {
                sentimentDbService.db('keywords').del()
            })
            .then(() => {
                done();
            });
    });

    it("saveTweet saves a valid analyzed tweet object to the DB", async () => {
        let didTweetSave = await sentimentDbService.saveTweet(testTweetToSave);

        expect(didTweetSave).toBeTruthy();
    });

    it("attempt to save duplicate tweet does not save properly", async () => {
        await sentimentDbService.saveTweet(testTweetToSave);
        let didTweetSave = await sentimentDbService.saveTweet(testTweetToSave);

        expect(didTweetSave).toBeFalsy();
    });

    it("attempt to save duplicate keyword does not save properly", async () => {
        await sentimentDbService.saveKeywords("test");
        let didKeywordsSave = await sentimentDbService.saveKeywords("test");

        expect(didKeywordsSave).toBeFalsy();
    });

    it("attempt to get active keywords after saving two tweets returns both keywords", async () => {
        await sentimentDbService.saveKeywords("test");
        await sentimentDbService.saveKeywords("test2");
        let activeKeywords = await sentimentDbService.getKeywordsByStatus("active");

        expect(activeKeywords[0].value).toEqual("test");
        expect(activeKeywords[1].value).toEqual("test2");
    });
});