import { Router } from "express";
import multer from "multer"
import { create, deleted, update } from "../controller/movieController";
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            cb(null, "./public/image")
        } else {
            cb(null, "./public/movie")
        }
    },
    filename: function (req, file, cb) {
        if (file.mimetype == "video/mp4") {
            const name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            cb(null, name + ".mp4")
        } else {
            const name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            cb(null, name + ".jpg")
        }
    }
})

const movie = multer({ storage: storage })

router.post("/create", movie.array("file", 2), create)
    .put("/edit/:id", movie.array("file", 2), update)
    .delete("/:id", deleted);



export { router }