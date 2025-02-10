import express from 'express';
import cors from 'cors';
import router from './router';
import 'dotenv/config';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';

connectDB();

const app = express();

//CORS
app.use(cors(corsConfig))

// allows express to read json request and response
app.use(express.json());

app.use('/api', router);

export default app;