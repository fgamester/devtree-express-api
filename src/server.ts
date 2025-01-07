import express from 'express';
import router from './router';
import 'dotenv/config';
import { connectDB } from './config/db';

const app = express();

connectDB();

// allows express to read json request and response
app.use(express.json());

app.use('/api', router);

export default app;