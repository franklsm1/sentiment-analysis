import { analyze, VALUE_OVERRIDES } from '../SentimentService';

describe('SentimentService', () => {
  it('should return proper score for the word #NotInGoodHands', () => {
    const textToAnalyze = '#NotInGoodHands';
    const expectedScore = VALUE_OVERRIDES.notingoodhands;
    expect(analyze(textToAnalyze)).toEqual(expectedScore);
  });

  it('should return a combined score when two words are ranked', () => {
    const textToAnalyze = 'cancel claim';
    const expectedScore = VALUE_OVERRIDES.cancel + VALUE_OVERRIDES.claim;
    expect(analyze(textToAnalyze)).toEqual(expectedScore);
  });
});
