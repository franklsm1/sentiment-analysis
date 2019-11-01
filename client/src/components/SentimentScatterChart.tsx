import React from 'react';
import _ from 'lodash';
import { 
    ScatterChart, 
    Scatter,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend } from 'recharts';
import { Posts } from '../models/Posts';
import { Post } from '../models/Post';
const DefaultTooltipContent = require('recharts/lib/component/DefaultTooltipContent')

const formatStringTime = (date: Date) => {
    const dateFromDate = new Date(date);
    const options = {hour: 'numeric', minute: 'numeric'};
    return dateFromDate.toLocaleTimeString('en-US', options);
}

const getSentimentData = (posts: Posts, sentiment: string) => {
    const sortedSentiment = _.sortBy(posts[sentiment], (post) => new Date(post.created_date));
    const formatted = sortedSentiment.map((post: Post) => (
        {
            y: post.sentiment,
            x: new Date(post.created_date).getTime(),
        }
    ));
    return formatted;
}

// TODO: Integrate this...
const CoolTip = (props: any) => {
    if (!props.active) {
        return null;
    }

    const newPayload = [
        {
            name: 'Date',
            value: 'banana',
        },
        ...props.payload,
    ]

    return <DefaultTooltipContent {...props} payload={newPayload} />
}

const SentimentScatterChart = ({ posts = { negative: [], neutral: [], positive: [] } }: { posts?: Posts }) => (
    <ResponsiveContainer aspect={4.0 / 3.0} width='100%'>
        <ScatterChart width={750} height={550}
            margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="x"
                name="date"
                type='number'
                domain={['auto','auto']}
                tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString('en-US')}
            />
            <YAxis dataKey="y" name="sentiment" unit="su" />
            <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                // Use the cool tip
                // content={() => (<CoolTip />)}
                formatter={(props => {
                    if (props > 10000) {
                        return new Date(props as number).toLocaleTimeString(
                            'en-US', 
                            {hour: 'numeric', minute: 'numeric'}
                        );
                    }

                    return props;
                })}
            />
            <Legend />
            <Scatter name="Positive" data={getSentimentData(posts, 'positive')} fill='green' />
            <Scatter name="Neutral" data={getSentimentData(posts, 'neutral')} fill="orange" />
            <Scatter name="Negative" data={getSentimentData(posts, 'negative')} fill="red" />
        </ScatterChart>
    </ResponsiveContainer>
);

export default SentimentScatterChart;