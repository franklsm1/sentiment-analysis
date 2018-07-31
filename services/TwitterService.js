import Twitter from 'twitter';
import Sentiment from 'sentiment';
import SentimentDbService from './SentimentDbService';
const sentiment = new Sentiment();

export default class TwitterService {
    constructor() {
        this.client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });
        this.sentimentDbService = new SentimentDbService();
    }

    createStream = (keywords) => {
        let stream = this.client.stream('statuses/filter', {
            track: keywords
        });

        stream.on('data', (event) => {
            if (event.extended_tweet && event.lang === "en") {
                let tweetObject = this.analyzeTweet(event);
                tweetObject.keywords = keywords;
                this.sentimentDbService.saveTweet(tweetObject);
            }
        });

        stream.on('error', (error) => {
            console.log(error)
        });

        return stream;
    };

    analyzeTweet = (event) => {
        let tweetText = event.extended_tweet.full_text;
        const sentimentAnalysis = sentiment.analyze(tweetText);
        return {
            id: event.id_str,
            sentiment: sentimentAnalysis.score,
            created_date: new Date(event.created_at),
            text: tweetText
        };
    };
}
