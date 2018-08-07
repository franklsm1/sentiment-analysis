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
        this.activeStreams = [];
    }

    createStream = (keywords) => {
        let stream = this.client.stream('statuses/filter', {
            track: keywords
        });

        stream.on('data', (event) => {
            if (!event.retweeted_status && event.lang === "en") {
                console.log(event);
                let tweetObject = this.analyzeTweet(event);
                tweetObject.keywords = keywords;
                this.sentimentDbService.saveTweet(tweetObject);
            }
        });

        stream.on('error', (error) => {
            console.log(error)
        });

        this.activeStreams.push(stream);
        return stream;
    };

    startActiveStreams = async () => {
        try {
            let keywordsList = await this.sentimentDbService.getKeywordsByStatus("active");
            keywordsList.forEach(keywords => {
                this.createStream(keywords.value);
            });
            if (this.activeStreams.length === 0) {
                const allStateKeywords = "#allstate,@allstate";
                await this.sentimentDbService.saveKeywords(allStateKeywords);
            }
        } catch (e) {
            console.log("error in startActiveStreams -->", e)
        }
    }

    analyzeTweet = (event) => {
        let tweetText = event.extended_tweet ? event.extended_tweet.full_text : event.text;
        const sentimentAnalysis = sentiment.analyze(tweetText);
        return {
            id: event.id_str,
            sentiment: sentimentAnalysis.score,
            created_date: new Date(event.created_at),
            text: tweetText
        };
    };
}