import React, { Component } from 'react';

import './App.css';
import Timeline from "./components/Timeline";
import Grid from "@material-ui/core/Grid";
import KeywordTable from "./components/KeywordsTable";
import NavBar from "./components/NavBar";
import SentimentPieChart from "./components/SentimentPieChart";

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount () {
    this.getKeywords();
    this.getPostsFromToday();
  }

  getKeywords = async () => {
    const response = await fetch(`${host}/api/v1/keywords`);
    const body = await response.json();

    if (response.status !== 200) {
      return console.log(body.message);
    }

    this.setState({ keywords: body });
  };

  getPostsFromToday = async () => {
    const today = new Date();
    const todaysDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const response = await fetch(`${host}/api/v1/posts?startDate=${todaysDate}`);
    const body = await response.json();

    if (response.status !== 200) {
      return console.log(body.message);
    }

    this.setState({ posts: body });
  };

  render () {
    return (
      <div className="App">
        <NavBar/>
        <Grid
            container
            spacing={3}
            direction="row"
            justify="flex-end"
            alignItems="center"
        >
          <Grid item xs/>
          <Grid item xs>
            {this.state.keywords && <KeywordTable keywords={this.state.keywords} />}
            {this.state.posts && <SentimentPieChart posts={this.state.posts}/>}
          </Grid>
          <Grid item xs className="MuiGrid-align-items-xs-flex-end">
            {this.state.posts && <Timeline posts={this.state.posts}/>}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
