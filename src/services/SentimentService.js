import Sentiment from 'sentiment';

const sentiment = new Sentiment();
export const VALUE_OVERRIDES = {
  notingoodhands: -13,
  cancel: -7,
  claim: -3,
  cancelled: -7,
  stranded: -7,
  totaled: -3,
  lawyer: -5,
  leaving: -7,
  limbo: -3,
  denied: -3,
  not: -2
};
const OPTIONS = { extras: VALUE_OVERRIDES };

export const analyze = (text) => sentiment.analyze(text, OPTIONS).score;
