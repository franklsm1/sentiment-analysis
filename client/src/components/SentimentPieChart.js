import React  from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const SentimentPieChart = ({posts}) => {
        let sentiments ={negative:[], neutral: [], positive: []};
        sentiments = posts.reduce((reduced, post) => {
            if (post.sentiment < -2) {
                reduced.negative.push(post);
            } else if (post.sentiment > 2) {
                reduced.positive.push(post)
            } else {
                reduced.neutral.push(post);
            }
            return reduced;
        }, sentiments);
    const data = [
        { name: 'Negative', value: sentiments.negative.length },
        { name: 'Neutral', value: sentiments.neutral.length },
        { name: 'Positive', value: sentiments.neutral.length },
    ];
        return (
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                </Pie>
            </PieChart>
        );
};

export default SentimentPieChart;
