import config from '../knexfile';
import knex from "knex";

export default class SentimentDbService {
    constructor() {
        this.db = knex(config[process.env.NODE_ENV || "development"]);
    }

    saveTweet = (analyzedTweet) => {
        if (analyzedTweet.text.length < 512) {
            return this.db('tweet').insert(analyzedTweet)
                .then(tweet => {
                    return true
                })
                .catch(error => {
                    console.log("error saving tweet -->", error.message);
                    return false;
                });
        }
        return null;
    };

    saveKeywords = (keywords) => {
        return this.db("keywords").insert({
                value: keywords,
                status: "active",
                created_date: new Date()
            })
            .then(() => {
                return true
            })
            .catch(error => {
                console.log("error saving keyword -->", error.message);
                return false;
            });
    }

    getKeywordsByStatus = (status) => {
        return this.db('keywords')
            .where("status", status);
    }

    getAllKeywords = () => {
        return this.db('keywords');
    }
}