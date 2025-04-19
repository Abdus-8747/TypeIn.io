import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"
import messageRoute from "./routes/message.route.js"
import cors from "cors"
import { app,server} from "./lib/socket.js"

import path from "path"

import { connectDB } from "./lib/db.js"

dotenv.config()


const PORT = process.env.PORT 
//const _dirname = path.resolve() 
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use('/api/auth', authRoute)
app.use('/api/messages', messageRoute)

app.get('/', (req, res) => {
    res.send('API is running...')
})
const _dirname = path.resolve()

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "../frontend/dist")))

  app.get('*', (req, res) => {
    res.sendFile(path.join(_dirname, "../frontend", "dist", "index.html"))
  })
}


server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})
