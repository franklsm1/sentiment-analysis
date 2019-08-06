import React  from 'react'
import { TwitterTweetEmbed } from "react-twitter-embed";

const Timeline = (props) => (
  <div id='timeline'>
    {
      props.tweets.map((post) => (
        <TwitterTweetEmbed
          key={post.id}
          tweetId={post.id}
          options={{
            cards: 'hidden',
            hideThread: true,
            conversation: 'none'
          }}
        />
      ))
    }
  </div>
);

export default Timeline;
