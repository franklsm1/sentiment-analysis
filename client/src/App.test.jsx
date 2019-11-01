import React from 'react';
import { render, act, cleanup } from '@testing-library/react';

import App from './App';

const mockKeywordsResponse = [{
  id: 1,
  value: '@allstate OR #allstate OR #NotInGoodHands',
  status: 'active',
  created_date: '2019-08-03T18:58:25.413Z',
  updated_date: '2019-08-03T18:58:26.920Z'
}];

const mockPostsResponse = [
  { id: '1189660171661910016',
    type: 'TWITTER',
    keyword_id: 1,
    sentiment: 10,
    created_date: '2019-10-30T21:47:42.000Z' },
  { id: '1189681666727567361',
    type: 'TWITTER',
    keyword_id: 1,
    sentiment: -3,
    created_date: '2019-10-30T23:07:42.000Z' },
  { id: '1189683071228030978',
    type: 'TWITTER',
    keyword_id: 1,
    sentiment: 0,
    created_date: '2019-10-30T23:18:42.000Z' }
];

describe('App', () => {
  let container;
  beforeEach(async () => {
    fetch.mockResponseOnce(JSON.stringify(mockKeywordsResponse), { status: 200 });
    fetch.mockResponseOnce(JSON.stringify(mockPostsResponse), { status: 200 });

    await act(async () => {
      container = render(<App/>);
    });
  });

  afterEach(() => {
    fetch.resetMocks();
    cleanup();
  });

  it('should render with keyword table, pie chart, and twitter post list', async () => {
    expect(container.getByText('Keyword')).toBeTruthy();
    expect(container.getByText('Sentiment Ratios')).toBeTruthy();
    expect(container.getByText('Analyzed Posts')).toBeTruthy();
  });
});
