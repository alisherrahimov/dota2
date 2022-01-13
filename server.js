import express from "express"
import { config } from "dotenv"
import cors from "cors"
import { router as userRoute } from "./routes/userRoute"
import { router as movieRoute } from "./routes/movieRoute"
import { router as homeRoute } from "./routes/homeRoute"
config()
const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/public", express.static('public'))
app.use("/api/auth", userRoute)
app.use("/api/movie", movieRoute)
app.use("/api/home", homeRoute)
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} run server db connecting`)
})