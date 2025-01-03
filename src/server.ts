import express from 'express'
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'

const app = express()

connectDB()

// permitimos la lectura de las request en formato json
app.use(express.json())

app.use('/api', router)

export default app