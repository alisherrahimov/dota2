import { Router } from "express";
import { getAll, getHome, getOne, searchMovie } from "../controller/movieController";
import { getByIdMovie, getAllTags } from "../controller/tagsController";

const router = Router();

router.get("/home", getHome)
router.get("/home/:id", getOne)
router.get("/all", getAll)
router.get("/search", searchMovie)
router.get("/tags", getAllTags)
router.get("/tags/:id", getByIdMovie)
export { router }