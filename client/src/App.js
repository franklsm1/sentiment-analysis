import React, { Component } from 'react';

import './App.css';
import Grid from "@material-ui/core/Grid";
import KeywordTable from "./components/KeywordsTable";
import NavBar from "./components/NavBar";
import SentimentPieChart from "./components/SentimentPieChart";
import SentimentPostList from "./components/SentimentPostList";
import Card from "@material-ui/core/Card";
import { CardContent } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount () {
    this.getKeywords();
    this.getPostsFromLastTwoDays();
  }

  getKeywords = async () => {
    const response = await fetch(`${host}/api/v1/keywords`);
    const body = await response.json();

    if (response.status !== 200) {
      return console.log(body.message);
    }

    this.setState({ keywords: body });
  };

  getPostsFromLastTwoDays = async () => {
    const today = new Date();
    const todaysDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const response = await fetch(`${host}/api/v1/posts?startDate=${todaysDate}`);
    const body = await response.json();

    if (response.status !== 200) {
      return console.log(body.message);
    }

    let posts ={negative:[], neutral: [], positive: []};
    posts = body.reduce((reduced, post) => {
      if (post.sentiment < -2) {
        reduced.negative.push(post);
      } else if (post.sentiment > 2) {
        reduced.positive.push(post)
      } else {
        reduced.neutral.push(post);
      }
      return reduced;
    }, posts);

    this.setState({ posts });
  };

  render () {
    return (
      <div className="App">
        <NavBar/>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="center"
          style={{paddingLeft: '1rem', paddingRight: '1rem'}}
        >
          <Grid item xs={12} md={3}>
            {this.state.keywords && <KeywordTable keywords={this.state.keywords} />}
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {`Sentiment Ratios`}
                </Typography>
                {this.state.posts && <SentimentPieChart posts={this.state.posts}/>}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                {this.state.posts && <SentimentPostList posts={this.state.posts}/>}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
