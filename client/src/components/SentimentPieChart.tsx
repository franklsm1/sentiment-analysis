import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Posts } from '../models/Posts';

const COLORS = ['red', 'orange', 'green'];

const RADIAN = Math.PI / 180;
// @ts-ignore
const renderLabel: React.ReactElement<any> = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0 ? (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : '';
};

const SentimentPieChart = (
    {
      posts = { negative: [], neutral: [], positive: [] },
      setNegativePiePostClicked, setNeutralPiePostClicked, setPositivePiePostClicked
    }:
        {posts?: Posts, setNegativePiePostClicked?: any, setNeutralPiePostClicked?: any, setPositivePiePostClicked?: any}) => {
  const data = [
    { name: 'Negative', value: posts.negative.length },
    { name: 'Neutral', value: posts.neutral.length },
    { name: 'Positive', value: posts.positive.length }
  ];
  return (
    <ResponsiveContainer aspect={4.0 / 3.0} width='100%'>
      <PieChart >
        <Legend verticalAlign="bottom" height={36}/>
        <Pie
          data={data}
          label={renderLabel}
          fill="#8884d8"
          legendType='circle'
          labelLine={false}
          dataKey={'value'}
        >
          {
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}
                                             onClick={(e)=>{

                                               switch (entry.name) {
                                                 case 'Negative':
                                                   setNegativePiePostClicked(true)
                                                   break;
                                                 case 'Positive':
                                                   setPositivePiePostClicked(true)
                                                   break;
                                                 case 'Neutral':
                                                   setNeutralPiePostClicked(true)
                                                   break;
                                               }
                                             }} />)
          }
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SentimentPieChart;
