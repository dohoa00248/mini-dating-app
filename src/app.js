import indexRouter from './routes/index.js';
import express from 'express';

const app = express();

app.use('/', indexRouter);

export default app;
