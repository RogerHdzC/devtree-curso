import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'
connectDB()
const app = express()
app.use(cors(corsConfig))
// To read data client-server
app.use(express.json())
app.use('/',router)
export default app