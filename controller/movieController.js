import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../config/errorHandler";
import { getVideoDurationInSeconds } from "get-video-duration"
import { format } from "../config/format";
import fs from "fs"
const client = new PrismaClient();
const create = async (req, res) => {
    const { title, description, rampage, tag_id } = req.body;
    const file = req.files;
    const duration = await getVideoDurationInSeconds(file[1].path)
    const movie_time = format(duration)
    try {
        const movie = await client.movies.create({
            data: {
                title: title,
                description: description,
                hero: { create: { tags: { connect: { id: tag_id } } } },
                movie_time: movie_time,
                rampage: rampage == "true" ? true : false,
                image: file[0].path,
                url: file[1].path,
            }
        })

        res.status(200).json({ message: "Movie created", data: movie });
    } catch (error) {
        errorHandler(error, res);
    }

}
const update = async (req, res) => {
    const { id } = req.params;
    const { title, description, rampage, tag_id } = req.body;
    const file = req.files;
    let duration
    if (file !== undefined) {
        duration = format(file[1].path)
    }
    try {
        const movie = await client.movies.update({
            where: { id: id },
            data: {
                title: { set: title },
                description: { set: description },
                hero: { set: { id: tag_id } },
                movie_time: { set: duration },
                rampage: { set: rampage == "true" ? true : false },
                image: { set: file[0].path },
                url: { set: file[1].path },
            },
        });

        res.status(200).json({ message: "Movie updated", data: movie });
    } catch (error) {
        errorHandler(error, res);
    }
}
const deleted = async (req, res) => {
    const { id } = req.params;
    try {

        const movie = await client.movies.delete({
            where: { id: id }
        });
        fs.unlink(movie.image, (err) => {
            if (err) throw err;
            fs.unlink(movie.url, (err) => {
                if (err) throw err;
                res.status(200).json({ message: "Movie deleted", data: movie });
            });
        })
    } catch (error) {
        errorHandler(error, res);
    }
}
const getAll = async (req, res) => {
    try {
        const movies = await client.movies.findMany({ include: { hero: { include: { tags: true } } } });
        res.status(200).json({ message: "Movies found", data: movies });
    } catch (error) {
        errorHandler(error, res);
    }
}
const getOne = async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await client.movies.findFirst({
            where: { id: id }, include: { hero: { include: { tags: true } } }
        });
        const tags = await client.tags.findMany({ include: { Movies: { include: { movies: true } } }, take: 15, })
        const comments = await client.comment.findMany({ where: { movies_id: id }, include: { author: true } })
        res.status(200).json({ message: "Movie found", data: movie, tags: tags, comments: comments });
    } catch (error) {
        errorHandler(error, res);
    }
}
const getHome = async (req, res) => {

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
        res.status(200).json({ message: "Movies found", data: allData });
    } catch (error) {
        errorHandler(error, res);
    }
}
const searchMovie = async (req, res) => {
    const { title } = req.query;
    try {
        const movies = await client.movies.findMany({ where: { title: { contains: title } } });
        res.status(200).json({ message: "Movies found", data: movies });
    } catch (error) {
        errorHandler(error, res);
    }
}

export { create, update, deleted, getOne, getHome, getAll, searchMovie }