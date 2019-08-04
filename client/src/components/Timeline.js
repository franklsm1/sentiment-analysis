import React  from 'react'
import { TwitterTweetEmbed } from "react-twitter-embed";

const Timeline = (props) => {
    console.log(props.posts);

    const tweets =  () => {
        return props.posts.map((post) => (
            <TwitterTweetEmbed
                key={post.id}
                tweetId={post.id}
                options={{
                    cards: 'hidden',
                    hideThread: true,
                    conversation: 'none',
                    width: '300',
                }}
            />
        ))};

    return (
        <div id='timeline'>
            {tweets()}
        </div>
    );
};

export default Timeline;
