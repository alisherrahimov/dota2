import fs from "fs"
export const imageConverter = async (image) => {
    return new Promise((resolve, reject) => {
        let buffer = Buffer.from(image, "base64")
        let fileName = `${Date.now()}.png`
        try {

            fs.createWriteStream(`./public/avatar/${fileName}`, { encoding: "base64" }).on("finish", () => {
                console.log("file created")
            }).write(buffer, (err) => {
                if (err) {
                    reject({ error: err })
                }
                resolve({ success: true, message: "file created" })
            })
        } catch (error) {
            reject({ error: err })
        }
    })
}