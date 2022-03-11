import { imageConverter } from "./helper/imageConverter"

export const userImageSet = async (io, user_id, image) => {
    imageConverter(user_id, image).then((res) => {
        io.emit("user_image", { message: "Image uploaded", success: true, data: res })
    }).catch(() => {
        io.emit("user_image", { message: "Image error", success: false })
    })
}