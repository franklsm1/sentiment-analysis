import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { CardContent } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import KeywordsTable from './components/KeywordsTable';
import NavBar from './components/NavBar';
import SentimentPieChart from './components/SentimentPieChart';
import SentimentScatterChart from './components/SentimentScatterChart';
import SentimentPostList from './components/SentimentPostList';
import './App.css';
import { getKeywords, getPosts } from './utils/requests';
import Radio from '@material-ui/core/Radio';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { Posts } from './models/Posts';

interface IKeyword {
  id: number,
  value: string
}

interface IKeywords extends Array<IKeyword>{}

const App: React.FC = () => {
  const [timeframeNumber, setTimeframeNumber] = React.useState(1);
  const [timeframeUnits, setTimeframeUnits] = React.useState('d');
  const [posts, setPosts] = React.useState<Posts>({ negative: [], positive: [], neutral: [] });
  const [selectedPosts, setSelectedPosts] = React.useState<Posts>({ negative: [], positive: [], neutral: [] });
  const [keywords, setKeywords] = React.useState<IKeywords>([]);
  const [selectedId, setSelectedId] = React.useState(1);

  const filterPosts = useCallback((selectedId: number, postsParam:Posts = posts) => {
    console.log('id --> ', selectedId, ' posts --->', postsParam);
    const filteredNegativePosts = postsParam.negative.filter(post => post && selectedId === post.keyword_id);
    const filteredPositivePosts = postsParam.positive.filter(post => post && selectedId === post.keyword_id);
    const filteredNeutralPosts = postsParam.neutral.filter(post => post && selectedId === post.keyword_id);
    // @ts-ignore
    setSelectedPosts({
      negative: filteredNegativePosts,
      positive: filteredPositivePosts,
      neutral: filteredNeutralPosts
    });
  }, [posts]);
  const [positivePiePostClicked, setPositivePiePostClicked] = useState(false);
  const [neutralPiePostClicked, setNeutralPiePostClicked] = useState(false);
  const [negativePiePostClicked, setNegativePiePostClicked] = useState(false);

  useEffect(() => {
    getKeywords(setKeywords);
    const loadPosts = async () => {
      // @ts-ignore
      const postResponse : Posts = await getPosts(timeframeNumber, timeframeUnits);
      await setPosts(postResponse);
      filterPosts(selectedId, postResponse);
    };
    loadPosts();
  }, [timeframeNumber, timeframeUnits, selectedId]);

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
          {keywords && <KeywordsTable setSelectedId={setSelectedId} keywords={keywords} filterPosts={filterPosts} />}
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {`Sentiment Ratios`}
              </Typography>
              {posts && <SentimentPieChart posts={selectedPosts}
                setNegativePiePostClicked={setNegativePiePostClicked}
                setNeutralPiePostClicked={setNeutralPiePostClicked}
                setPositivePiePostClicked={setPositivePiePostClicked}/>}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              {posts && <SentimentPostList posts={selectedPosts}
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {`Sentiment Scatter Chart`}
              </Typography>
              {posts && <SentimentScatterChart posts={selectedPosts} />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
