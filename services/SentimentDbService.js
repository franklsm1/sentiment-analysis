import config from '../knexfile';
import knex from "knex";

export default class SentimentDbService {
    constructor() {
        this.db = knex(config);
    }

    saveTweet = (analyzedTweet) => {
        return this.db('tweet').insert(analyzedTweet)
            .then(tweet => {
                console.log("saved tweet");
                return true
            })
            .catch(error => {
                // current errors include too long of a message ( > 500 chars)
                console.log(error.message);
                return false;
            });
    };

}