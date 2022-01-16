import { PrismaClient } from "prisma/prisma-client"
import { errorHandler } from "../config/errorHandler";
const client = new PrismaClient()
import data from "../hero.json"
const getByIdMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await client.movies.findMany({
            where: {
                id: id
            },
            include: {
                hero: true
            }
        })
        res.status(200).json({ message: "Tag created", movie })
    } catch (error) {
        errorHandler(error, res);
    }
}
const getAllTags = async (req, res) => {
    try {
        const tags = await client.tags.findMany()
        res.status(200).json({ message: "Tags found", tags })
    } catch (error) {
        errorHandler(error, res);
    }
}
export { getByIdMovie, getAllTags }