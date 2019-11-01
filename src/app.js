import express from 'express';
import cors from 'cors';

import posts from './controllers/posts';
import keywords from './controllers/keywords';

const app = express();
const baseApiEndpoint = '/api/v1';

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(baseApiEndpoint + '/posts', posts);
app.use(baseApiEndpoint + '/keywords', keywords);

module.exports = app;
