import { Router } from "express";
import { getAll, getHome, getOne, searchMovie } from "../controller/movieController";

const router = Router();

router.get("/home", getHome)
router.get("/home/:id", getOne)
router.get("/all", getAll)
router.get("/search", searchMovie)
export { router }