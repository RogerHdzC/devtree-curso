import express from 'express'
import router from './router'
const app = express()
// To read data client-server
app.use(express.json())
app.use('/',router)
export default app