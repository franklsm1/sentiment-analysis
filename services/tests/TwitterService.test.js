import TwitterService from "../TwitterService";
import sinon from "sinon";
import stream from "stream";

const mockStream = new stream.Readable();
mockStream._read = () => {};
mockStream.destroy = () => {};

// Sends a Tweet event to the mock stream
function writeTweetToStream(event) {
    mockStream.emit('data',event);
}

describe('Service that uses the Twitter Streaming API', () => {
    let twitterService;
    let steamStub;

    beforeEach( () => {
        twitterService = new TwitterService();
        steamStub = sinon.stub(twitterService.client, "stream")
            .callsFake(() => mockStream);
    });

    it('new tweet is analyzed with a sentiment score and saved to the DB', () => {
        let mockAnalyzedTweet = {
            id: "123",
            sentiment: -5,
            created_date: new Date(),
            text: 'This is a negative #test tweet',
        };

        twitterService.analyzeTweet = jest.fn().mockReturnValue(mockAnalyzedTweet);
        twitterService.sentimentDbService = ({saveTweet : jest.fn()});
        let testStream = twitterService.createStream("test");

        writeTweetToStream({
            text: mockAnalyzedTweet.text,
            lang: "en"
        });

        expect(steamStub.calledOnce).toBeTruthy();
        expect(twitterService.sentimentDbService.saveTweet).toHaveBeenCalledTimes(1);
        expect(twitterService.analyzeTweet).toHaveBeenCalledTimes(1);
    });

    it('new tweet is NOT analyzed if it is not in english', () => {
        twitterService.analyzeTweet = jest.fn().mockReturnValue({});
        let testStream = twitterService.createStream("#test");

        writeTweetToStream( {
            text: 'This is a japanese tweet',
            lang: "jp"
        });

        expect(steamStub.calledOnce).toBeTruthy();
        expect(twitterService.analyzeTweet).toHaveBeenCalledTimes(0);
    });

    it('new tweet is NOT analyzed if it is a retweet', () => {
        twitterService.analyzeTweet = jest.fn().mockReturnValue({});
        let testStream = twitterService.createStream("#test");

        writeTweetToStream({
            retweeted_status: true
        });

        expect(steamStub.calledOnce).toBeTruthy();
        expect(twitterService.analyzeTweet).toHaveBeenCalledTimes(0);
    });

    it('analyze tweet returns tweet object with sentiment score', () => {
        let tweetEvent = {
            id_str: "123",
            text: "analyze this...",
            created_at: new Date(),
            extended_tweet: {
                full_text: "analyze this bad negative tweet"
            }
        }
        let tweetAnalysis = twitterService.analyzeTweet(tweetEvent);

        expect(tweetAnalysis.id).toBe(tweetEvent.id_str);
        expect(tweetAnalysis.created_date).toEqual(tweetEvent.created_at);
        expect(tweetAnalysis.text).toBe(tweetEvent.extended_tweet.full_text);
        expect(tweetAnalysis.sentiment).toBe(-5);
    });
});