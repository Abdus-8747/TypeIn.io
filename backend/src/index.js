import express from "express"
import authRoute from "./routes/auth.route.js"

const app = express()

app.use('/api/auth', authRoute)

app.listen(5000, () => {
    console.log("Server Started At Port 5000")
})