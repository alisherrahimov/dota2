import { Router } from "express";
import { deleted, login, me, register, setPhoto, update } from "../controller/userController";
import { checkToken } from "../middleware/checkToken";
import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/avatar")
    },
    filename: function (req, file, cb) {
        const name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        cb(null, name + ".jpg")
    }
})
const image = multer({ storage: storage })

const router = Router();

router.get("/me", checkToken, me)
    .post("/register", register)
    .post("/login", login)
    .put("/edit/:id", update)
    .delete("/delete/:id", deleted);
router.put("/image", checkToken, image.single("image"), setPhoto)
export { router }