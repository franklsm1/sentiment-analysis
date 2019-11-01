import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { CardContent } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import KeywordsTable from './components/KeywordsTable';
import NavBar from './components/NavBar';
import SentimentPieChart from './components/SentimentPieChart';
import SentimentPostList from './components/SentimentPostList';
import './App.css';
import { getKeywords, getPosts } from './utils/requests';
import Radio from '@material-ui/core/Radio';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';

const App: React.FC = () => {
  const [timeframeNumber, setTimeframeNumber] = useState(1);
  const [timeframeUnits, setTimeframeUnits] = React.useState('d');
  const [posts, setPosts] = useState(undefined);
  const [keywords, setKeywords] = useState(undefined);
  const [positivePiePostClicked, setPositivePiePostClicked] = useState(false);
  const [neutralPiePostClicked, setNeutralPiePostClicked] = useState(false);
  const [negativePiePostClicked, setNegativePiePostClicked] = useState(false);

  useEffect(() => {
    getKeywords(setKeywords);
    getPosts(timeframeNumber, timeframeUnits, setPosts);
  }, [timeframeNumber, timeframeUnits]);

  const handleNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => setTimeframeNumber(Number(event.target.value));
  const handleUnitChange = (event: React.ChangeEvent<{}>, value: string) => setTimeframeUnits(value);

  return (
    <div className="App">
      <NavBar/>
      <Grid container
        justify="center"
        alignItems="center"
        style={{ padding: '1rem' }}>
        <Card>
          <CardContent style={{ display: 'flex', flexWrap: 'wrap' }}>
            <NativeSelect
              value={timeframeNumber}
              onChange={handleNumberChange}
            >
              {Array.from(new Array(30), (x, i) => i + 1).map(number =>
                <option key={number} value={number}>{number}</option>
              )}
            </NativeSelect>
            <RadioGroup aria-label="position" name="position" value={timeframeUnits} onChange={handleUnitChange} row>
              <FormControlLabel
                value="d"
                control={<Radio color="primary" />}
                label="Day(s)"
                labelPlacement="top"
              />
              <FormControlLabel
                value="h"
                control={<Radio color="primary" />}
                label="Hour(s)"
                labelPlacement="top"
              />
            </RadioGroup>
          </CardContent>
        </Card>
      </Grid>
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
        style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
      >
        <Grid item xs={12} md={6} lg={3}>
          {keywords && <KeywordsTable keywords={keywords} />}
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {`Sentiment Ratios`}
              </Typography>
              {posts && <SentimentPieChart posts={posts}
                                           setNegativePiePostClicked={setNegativePiePostClicked}
                                           setNeutralPiePostClicked={setNeutralPiePostClicked}
                                           setPositivePiePostClicked={setPositivePiePostClicked}/>}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              {posts && <SentimentPostList posts={posts}
                                           negativePiePostClicked={negativePiePostClicked}
                                           neutralPiePostClicked={neutralPiePostClicked}
                                           positivePiePostClicked={positivePiePostClicked}
                                           setNegativePiePostClicked={setNegativePiePostClicked}
                                           setNeutralPiePostClicked={setNeutralPiePostClicked}
                                           setPositivePiePostClicked={setPositivePiePostClicked}
              />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
