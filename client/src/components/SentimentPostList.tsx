import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Timeline from './Timeline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Posts } from '../models/Posts';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

export default function SentimentPostList (
  { posts = { negative: [], neutral: [], positive: [] },
    negativePiePostClicked, neutralPiePostClicked, positivePiePostClicked,
    setNegativePiePostClicked, setNeutralPiePostClicked, setPositivePiePostClicked }:
  {posts?: Posts, negativePiePostClicked?: boolean, neutralPiePostClicked?: boolean, positivePiePostClicked?: boolean,
    setNegativePiePostClicked?: any, setNeutralPiePostClicked?: any, setPositivePiePostClicked?: any, }) {
  const classes = useStyles();
  const [openNegative, setOpenNegative] = React.useState(false);
  const [openPositive, setOpenPositive] = React.useState(false);
  const [openNeutral, setOpenNeutral] = React.useState(false);

  if (negativePiePostClicked && !openNegative) {
    setOpenNegative(true);
  }
  if (positivePiePostClicked && !openPositive) {
    setOpenPositive(true);
  }
  if (neutralPiePostClicked && !openNeutral) {
    setOpenNeutral(true);
  }

  const closeAllAccordions = () => {
    setOpenNegative(false);
    setOpenPositive(false);
    setOpenNeutral(false);
  };

  // reset the pie clicked trigger state
  setNegativePiePostClicked(false);
  setNeutralPiePostClicked(false);
  setPositivePiePostClicked(false);

  const handleNegativeClick = () => setOpenNegative(!openNegative);
  const handlePositiveClick = () => setOpenPositive(!openPositive);
  const handleNeutralClick = () => setOpenNeutral(!openNeutral);

  return (
    <List
      component="nav"
      onBlur={closeAllAccordions}
      aria-labelledby="nested-list-subheader"
      subheader={
        <Typography variant="h6">
          Analyzed Posts
        </Typography>
      }
      className={classes.root}
    >
      <Divider />
      <ListItem button onClick={handlePositiveClick}>
        <ListItemIcon>
          <ThumbUpIcon />
        </ListItemIcon>
        <ListItemText primary="Show Positive Posts" />
        {openPositive ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openPositive} timeout="auto" unmountOnExit>
        <Timeline tweets={posts.positive}/>
      </Collapse>
      <Divider component="li" />
      <ListItem button onClick={handleNeutralClick}>
        <ListItemIcon>
          <ThumbsUpDownIcon />
        </ListItemIcon>
        <ListItemText primary="Show Neutral Posts" />
        {openNeutral ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openNeutral} timeout="auto" unmountOnExit>
        <Timeline tweets={posts.neutral}/>
      </Collapse>
      <Divider component="li" />
      <ListItem button onClick={handleNegativeClick}>
        <ListItemIcon>
          <ThumbDownIcon />
        </ListItemIcon>
        <ListItemText primary="Show Negative Posts" />
        {openNegative ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openNegative} timeout="auto" unmountOnExit>
        <Timeline tweets={posts.negative}/>
      </Collapse>
    </List>
  );
}
