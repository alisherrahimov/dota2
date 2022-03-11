
import { changePassword, createComment, getAllComment, login, recoveryPassword, register, verifyCode } from "../auth"
import { getById, home, getAll, getByTagId, searchMovie, } from "../home"
import { userImageSet } from "../user"

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
    socket.on("all_movies", () => {
        getAll(io)
    })
    socket.on("create_comment", (data) => {
        createComment(io, data)
    })
    socket.on("get_all_comment", (data) => {
        getAllComment(io, data)
    })
    socket.on("tag_by_id", (data) => {
        getByTagId(io, data)
    })
    socket.on("user_image", (user_id, image) => {
        const { id } = user_id
        userImageSet(io, id, image)
    })
    socket.on("recovery_password", (data) => {
        recoveryPassword(io, data)
    })
    socket.on("verify_code", (data) => {
        verifyCode(io, data)
    })
    socket.on("change_password", (data) => {
        changePassword(io, data)
    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
    })
}