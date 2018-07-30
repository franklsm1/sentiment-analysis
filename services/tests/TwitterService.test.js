import TwitterService from "../TwitterService";
import sinon from "sinon";
import stream from "stream";

const mockStream = new stream.Readable();
mockStream._read = () => {};
mockStream.destroy = () => {};

// Sends a Tweet event to the mock stream
function writeTweetToStream(text) {
    mockStream.emit('data', {
        text: text
    })
}

describe('Service that uses the Twitter Streaming API', () => {
    let twitterService
    let steamStub;
    
    beforeAll(() => {
        twitterService = new TwitterService();
        steamStub = sinon.stub(twitterService.client, "stream")
            .callsFake(() => mockStream);
    });

    it('process incoming tweets', () => {
        twitterService.analyzeTweet = jest.fn();
        let testStream = twitterService.createStream("#test");

        writeTweetToStream('This is a #test tweet');

        expect(steamStub.calledOnce).toBeTruthy();
        expect(twitterService.analyzeTweet).toHaveBeenCalledTimes(1);
    });
});
