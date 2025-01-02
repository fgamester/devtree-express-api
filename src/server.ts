import express from 'express'
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'

const app = express()

connectDB()

// Allowing read form data
app.use(express.json())

app.use('/api', router)

export default app