import express from 'express';
import 'dotenv/config';
import router from './router';
import { connectDB } from './config/db';

const app = express();

connectDB();

// allows express to read json request and response
app.use(express.json());

app.use('/api', router);

export default app;