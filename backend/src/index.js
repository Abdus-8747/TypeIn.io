import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"
import messageRoute from "./routes/message.route.js"
import cors from "cors"

import { connectDB } from "./lib/db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT 
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use('/api/auth', authRoute)
app.use('/api/message', messageRoute)

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})
