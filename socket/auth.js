import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const client = new PrismaClient()
export const register = async (io, data) => {
    const { username, email, password } = data


    if (!username || !email || !password) {
        return io.emit("register", { data: "Please fill all fields", success: false })
    }
    const user = await client.user.findFirst({ where: { email: email } });
    if (user) {
        return io.emit("register", { data: "User already exists", success: false })
    }
    const hash = bcrypt.hashSync(password, 10);

    const newUser = await client.user.create({
        data: {
            username: username,
            email: email,
            password: hash
        }
    });
    return io.emit("register", { success: true, data: newUser })

}
export const login = async (io, data) => {
    const { email, password } = data

    const user = await client.user.findFirst({ where: { email: email } });
    if (!user) {
        io.emit("login", { data: "User does not exist", success: false })
        return
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        io.emit("login", { data: "Invalid password", success: false })
    }
    else {
        const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: "365d" });
        return io.emit("login", { message: "User logged in", success: true, token: token })
    }

}
export const createComment = async (io, data) => {
    const { id } = data.id
    const { content, movie_id } = data.body;
    try {
        const comment = await client.comment.create({
            data: {
                content: content,
                user_id: id,
                movies_id: movie_id,
                author: { connect: { id } }
            }
        })

        io.emit("create_comment", { message: "comment wrote" })

    } catch (error) {
        io.emit("create_comment", { message: "comment not wrote" })
    }
}
export const getAllComment = async (io, data) => {
    const id = data.id;
    try {
        const comment = await client.comment.findMany({
            where: { movies_id: id },
            include: { author: true }
        })
        io.emit("get_all_comment", { comment })
    } catch (error) {
        io.emit("get_all_comment", { message: "comment not wrote" })
    }
}
