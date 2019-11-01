import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import KeywordsTable from '../KeywordsTable';

const keywordList = [
  {
    id: '1',
    value: 'MEAN_THING_TO_SAY_ABOUT_ALLSTATE_1',
    status: 'active'
  },
  {
    id: '2',
    value: 'MEAN_THING_TO_SAY_ABOUT_ALLSTATE_2',
    status: 'active'
  }
];

describe('Keyword Table', () => {
  let container, keyword1, keyword2, keyword1Status, keyword2Status;
  const setup = (config = {}) => {
    container = render(<KeywordsTable keywords={keywordList}/>);
    keyword1 = container.getByRole(keywordList[0].id);
    keyword2 = container.getByRole(keywordList[1].id);
  };

  describe('renders UI', () => {
    xit('should match snapshot', () => {
      setup();
      expect(container).toMatchSnapshot();
    });
  });

  describe('displays keyword list', () => {
    it('should display all keywords in list', () => {
      setup();
      expect(keyword1).toBeTruthy();
      expect(keyword2).toBeTruthy();
    });

    it('should select keyword in list', () => {
      setup();
      keyword1Status = container.getByRole(keywordList[0].id).getAttribute('aria-checked');
      keyword2Status = container.getByRole(keywordList[1].id).getAttribute('aria-checked');
      expect(keyword1Status).toBeTruthy();
      expect(keyword2Status === 'false').toBeTruthy();
      fireEvent.click(keyword2);
      expect(keyword2Status).toBeTruthy();
      expect(keyword1Status === 'false').toBeTruthy();
    });
  });
});
