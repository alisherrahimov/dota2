
import { createComment, getAllComment } from "../auth"
import { getById, home, getAll, getByTagId, searchMovie, } from "../home"

export const socketRoute = (socket, io) => {
    console.log("connected", socket.id)

    socket.on("register", (data) => {
        register(io, data)
    })
    socket.on("login", (data) => {
        login(io, data)
    })
    socket.on("home", () => {
        home(io)
    })
    socket.on("id", (id) => {
        getById(io, id)
    })
    socket.on("search", (text) => {
        searchMovie(io, text)
    })
    socket.on("allmovies", () => {
        getAll(io)
    })
    socket.on("createcomment", (data) => {
        createComment(io, data)
    })
    socket.on("getallcomment", (data) => {
        getAllComment(io, data)
    })
    socket.on("tagbyid", (data) => {
        getByTagId(io, data)
    })
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
    })
}