import fs from "fs"
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from "prisma/prisma-client"
const client = new PrismaClient()
export const imageConverter = async (id, image) => {
    return new Promise((resolve, reject) => {
        let buffer = Buffer.from(image, "base64")
        let fileName = `${uuidv4()}`
        let path = `./public/avatar/${fileName}.png`
        try {
            fs.createWriteStream(path, { encoding: "base64" }).write(buffer, async (err) => {
                if (err) {
                    reject({ error: err })
                }
                const data = await client.user.update({ where: { id: id }, data: { image: { set: path } } })
                resolve(data)
            })
        } catch (error) {
            reject({ error: err })
        }
    })
}