import { PrismaClient } from "prisma/prisma-client"
import { errorHandler } from "../config/errorHandler";
const client = new PrismaClient()
const createComment = async (req, res) => {
    const { id } = req.user
    const { content, movie_id } = req.body;
    try {
        const comment = await client.comment.create({
            data: {
                content: content,
                user_id: id,
                movies_id: movie_id,
                author: { connect: { id } }
            }
        })
        res.status(201).json({ comment })

    } catch (error) {
        errorHandler(error, res)
    }
}

const getAllComment = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await client.comment.findMany({
            where: { movies_id: id },
            include: { author: true }
        })
        res.status(200).json({ comment })
    } catch (error) {
        errorHandler(error, res)
    }
}
export { createComment, getAllComment }