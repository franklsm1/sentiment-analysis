import TwitterService from "../TwitterService";
import sinon from "sinon";
import stream from "stream";

const mockStream = new stream.Readable();
mockStream._read = () => {};
mockStream.destroy = () => {};

// Sends a Tweet event to the mock stream
function writeTweetToStream(text, options = {}) {
    mockStream.emit('data', {
        extended_tweet: options.isFullText === false ? undefined : {
            full_text: text
        },
        lang: options.lang || "en"

    })
}

describe('Service that uses the Twitter Streaming API', () => {
    let twitterService
    let steamStub;

    beforeEach(() => {
        twitterService = new TwitterService();
        steamStub = sinon.stub(twitterService.client, "stream")
            .callsFake(() => mockStream);
    });

    it('new tweet is analyzed with a sentiment score', () => {
        twitterService.analyzeTweet = jest.fn().mockReturnValue({});
        let testStream = twitterService.createStream("#test");

        writeTweetToStream('This is a #test tweet');

        expect(steamStub.calledOnce).toBeTruthy();
        expect(twitterService.analyzeTweet).toHaveBeenCalledTimes(1);
    });

    it('new tweet is NOT analyzed if it is not in english', () => {
        twitterService.analyzeTweet = jest.fn().mockReturnValue({});
        let testStream = twitterService.createStream("#test");

        writeTweetToStream('This is a japanese tweet', {lang: "jp"});

        expect(steamStub.calledOnce).toBeTruthy();
        expect(twitterService.analyzeTweet).toHaveBeenCalledTimes(0);
    });

    it('new tweet is NOT analyzed if it is a retweet', () => {
        twitterService.analyzeTweet = jest.fn().mockReturnValue({});
        let testStream = twitterService.createStream("#test");

        writeTweetToStream('This is a japanese tweet', {isFullText: false});

        expect(steamStub.calledOnce).toBeTruthy();
        expect(twitterService.analyzeTweet).toHaveBeenCalledTimes(0);
    });

    it('analyze tweet returns tweet object with sentiment score', () => {
        let tweetEvent = {
            id_str: "123",
            created_at: new Date(),
            extended_tweet: {
                full_text: "analyze this bad negative tweet"
            }
        }
        let tweetAnalysis = twitterService.analyzeTweet(tweetEvent);

        expect(tweetAnalysis.id).toBe(tweetEvent.id_str);
        expect(tweetAnalysis.created_date).toBe(tweetEvent.created_at);
        expect(tweetAnalysis.text).toBe(tweetEvent.extended_tweet.full_text);
        expect(tweetAnalysis.sentiment).toBe(-5);
    });
});
