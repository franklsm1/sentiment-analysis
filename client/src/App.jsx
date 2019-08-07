import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import KeywordTable from './components/KeywordsTable';
import NavBar from './components/NavBar';
import SentimentPieChart from './components/SentimentPieChart';
import SentimentPostList from './components/SentimentPostList';
import './App.css';
import { getKeywords, getPostsFromLastTwoDays } from './utils/requests';

const App = () => {
  const [posts, setPosts] = useState(undefined);
  const [keywords, setKeywords] = useState(undefined);
  useEffect(() => {
    getKeywords(setKeywords);
    getPostsFromLastTwoDays(setPosts);
  }, []);

  return (
    <div className="App">
      <NavBar/>
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
        style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
      >
        <Grid item xs={12} md={6} lg={3}>
          {keywords && <KeywordTable keywords={keywords} />}
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {`Sentiment Ratios`}
              </Typography>
              {posts && <SentimentPieChart posts={posts}/>}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              {posts && <SentimentPostList posts={posts}/>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
