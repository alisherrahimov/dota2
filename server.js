import express from "express"
import { config } from "dotenv"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import { router as userRoute } from "./routes/userRoute"
import { router as movieRoute } from "./routes/movieRoute"
import { router as homeRoute } from "./routes/homeRoute"

import { socketRoute } from "./socketcontroller/socketRoute/routes"
import { imageConverter } from "./socketcontroller/helper/imageConverter"
const PORT = process.env.PORT || 3000
config()
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/public", express.static('public'))
app.use("/api/auth", userRoute)
app.use("/api/movie", movieRoute)
app.use("/api/home", homeRoute)
io.on("connection", async (socket) => {
    socketRoute(socket, io)
    socket.on("upload", async (data) => {
        imageConverter(data).then(res => {
            socket.emit("upload", res)
        }).catch(err => {
            socket.emit("upload", err)
        })
        io.emit("upload", "asdasda")
    })
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT} run server db connecting`)
})

