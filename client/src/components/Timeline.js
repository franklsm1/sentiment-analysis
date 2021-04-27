import React, { useState } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import InfiniteScroll from 'react-infinite-scroll-component';

const Timeline = (props) => {
  const offsetNumber = 2;
  const numberOfItemsToLoad = props.tweets.length > offsetNumber ? offsetNumber : props.tweets.length;
  const [hasMore, setHasMore] = useState(props.tweets.length > offsetNumber);
  const [currentPostIndex, setCurrentPostIndex] = useState(numberOfItemsToLoad);
  const addNextTweets = () => {
    if (currentPostIndex + numberOfItemsToLoad >= props.tweets.length) {
      setHasMore(false);
      setCurrentPostIndex(props.tweets.length);
    } else {
      setCurrentPostIndex(currentPostIndex + numberOfItemsToLoad);
    }
  };

  return (
    <div id='timeline'>
      <InfiniteScroll
        dataLength={currentPostIndex}
        next={addNextTweets}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {
          props.tweets.slice(0, currentPostIndex).map((post) => (
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
      </InfiniteScroll>
    </div>
  );
};

export default Timeline;
