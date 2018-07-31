import SentimentDbService from "../SentimentDbService";
import config from '../../knexfile';
import knex from "knex";

let db = knex(config);

describe("Sentiment DB Service", () => {
    let sentimentDbService;

    beforeAll(() => {
        sentimentDbService = new SentimentDbService();
    });

    beforeEach(async () => {
        await db('tweet')
            .where({
                keywords: "test"
            })
            .del();
    });

    it("saveTweet saves a valid analyzed tweet object to the DB", async () => {
        let tweetToSave = {
            id: "123",
            sentiment: -5,
            created_date: new Date(),
            text: "fake negative tweet text",
            keywords: "test"
        };
        let didTweetSave = await sentimentDbService.saveTweet(tweetToSave);

        expect(didTweetSave).toBeTruthy();
    });

    it("attempt to save duplicate tweet does not save properly", async () => {
        let tweetToSave = {
            id: "123",
            sentiment: -5,
            created_date: new Date(),
            text: "fake negative tweet text",
            keywords: "test"
        };
        
        await sentimentDbService.saveTweet(tweetToSave);
        let didTweetSave = await sentimentDbService.saveTweet(tweetToSave);

        expect(didTweetSave).toBeFalsy();
    });
});