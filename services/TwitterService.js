import Twitter from 'twitter';

export default class TwitterService {
    constructor() {
        this.client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });
    }

    createStream = (keywords) => {
        let stream = this.client.stream('statuses/filter', {
            track: keywords
        });

        stream.on('data', (event) => {
            this.analyzeTweet(event)
        });

        stream.on('error', (error) => {
            throw error;
        });

        return stream;
    }

    analyzeTweet = (event) => {
        console.log(event.text);
    }
}
