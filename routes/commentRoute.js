import { Router } from "express"
import { createComment, getAllComment } from "../controller/commentController";
import { checkToken } from "../middleware/checkToken";
const route = Router();

route.post("/create", checkToken, createComment)
route.get("/all/:id", checkToken, getAllComment)