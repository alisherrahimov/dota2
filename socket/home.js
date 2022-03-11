import { PrismaClient } from "prisma/prisma-client"
const client = new PrismaClient();
export const home = async (io) => {
    const allData = []

    try {
        const movies = await client.movies.findMany({ where: { rampage: true, }, take: 10 });
        allData.push({ rampage: movies })
        const movies2 = await client.movies.findMany({ orderBy: { view: "desc", }, where: { rampage: false }, take: 10 });
        allData.push({ popular: movies2 })
        const movies3 = await client.movies.findMany({ orderBy: { createdAt: "desc", }, where: { rampage: false }, take: 10 });
        allData.push({ latest: movies3 })
        const otherMovies = await client.movies.findMany({ where: { rampage: false, } });
        allData.push({ other: otherMovies })
        io.emit('home', { success: true, data: allData });
    } catch (error) {
        io.emit("home", { success: false, data: error });
    }
}
export const getById = async (io, id) => {

    try {
        const data = await client.movies.findFirst({
            where: {
                id: id,
            },
            include: { hero: { include: { tags: true } } }
        })
        const tags = await client.tags.findMany()
        const newTag = []
        tags.forEach((tag, index) => {
            let i = Math.round(Math.random() * (tags.length - 1))
            newTag.includes((tags[i].id)) ? null : newTag.push(tags[i])
        })


        if (data) {
            io.emit("id", { success: true, data: data, tags: newTag.slice(0, 10) });
        } else {
            io.emit("id", { success: false, data: "Movie not found" });
        }

    } catch (error) {
        io.emit("id", { data: null, err: error })
    }
}
export const searchMovie = async (io, text) => {
    try {
        const movies = await client.movies.findMany({
            where: {
                title: { contains: text, mode: "insensitive" },
                hero: { every: { tags: { name: { contains: text, mode: "insensitive" } } } }
            }
        });

        if (movies.length > 0) {
            io.emit("search", { success: true, data: movies });
        } else {
            io.emit("search", { success: false, message: "Movie not found" });
        }
    } catch (error) {
        io.emit("search", { success: false, data: error });
    }
}
export const getAll = async (io) => {
    try {
        const movies = await client.movies.findMany({ include: { hero: { include: { tags: true } } } });
        io.emit("all_movies", { success: true, data: movies });
    } catch (error) {
        io.emit("all_movies", { success: false, data: error });
    }
}
export const getByTagId = async (io, id) => {
    try {
        const movies = await client.movies.findMany({
            where: {
                hero: { every: { tags_id: id } }
            }
        })
        io.emit("tag_by_id", { success: true, data: movies });
    } catch (error) {
        io.emit("tag_by_id", { success: false, data: error });
    }
}
