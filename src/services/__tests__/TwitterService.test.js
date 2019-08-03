import TwitterService, { baseTwitterSearchUrl, defaultFetchOptions } from "../TwitterService";
import SentimentDbService from '../SentimentDbService';
const fetchMock = require('node-fetch');

jest.mock('../SentimentDbService');

describe('Service gets latest tweets on startup', () => {
    afterEach(() => {
        fetchMock.reset();
    });

    it('new tweets are analyzed with a sentiment score and saved to the DB', async () => {
        const mockSearchResponse = {
            statuses: [
                {
                    id: 123,
                    id_str: "123",
                    text: 'test tweet #allstate',
                    created_at: new Date()
                }
            ],
        };
        const keywords = '#allstate OR @allstate';
        const mockGetKeywordsByStatus = jest.fn().mockImplementation(() => Promise.resolve([{value: keywords}]));
        const mockSaveTweet = jest.fn().mockImplementation(() => Promise.resolve('Success'));

        SentimentDbService.mockImplementation(() => {
            return {
                getKeywordsByStatus: mockGetKeywordsByStatus,
                saveTweet: mockSaveTweet,
            }
        });

        fetchMock.mock("begin:" + baseTwitterSearchUrl, {
            status: 200,
            headers: defaultFetchOptions.headers,
            body: mockSearchResponse
        });

        await new TwitterService();

        let expectedAnalyzedTweet = {
            id: mockSearchResponse.statuses[0].id_str,
            keywords,
            sentiment: 0,
            created_date: mockSearchResponse.statuses[0].created_at,
            text: mockSearchResponse.statuses[0].text,
        };

        expect(mockGetKeywordsByStatus).toHaveBeenCalledTimes(1);
        expect(mockGetKeywordsByStatus).toHaveBeenCalledWith('active');
        expect(mockSaveTweet).toHaveBeenCalledTimes(1);
        expect(mockSaveTweet).toHaveBeenCalledWith(expectedAnalyzedTweet);
    });
});
