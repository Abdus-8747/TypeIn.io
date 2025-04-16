import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT 
connectDB()

app.use(express.json())
app.use('/api/auth', authRoute)

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})
