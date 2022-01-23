import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import fs from "fs"
import jwt from "jsonwebtoken"
import { errorHandler } from "../config/errorHandler";
const client = new PrismaClient();
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await client.user.findFirst({ where: { email: email } });
        if (user) {
            res.status(400).json({ message: "User already exists", success: false });
        }
        else {
            const hash = bcrypt.hashSync(password, 10);

            const newUser = await client.user.create({
                data: {
                    username: username,
                    email: email,
                    password: hash
                }
            });
            res.status(200).json({ success: true, data: newUser });
        }

    } catch (error) {
        errorHandler(error, res);
    }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await client.user.findFirst({ where: { email: email } });
        if (!user) {
            res.status(400).json({ message: "User does not exist", success: false });
        }
        else {
            const isValid = await bcrypt.compare(password, user.password);

            if (!isValid) {
                res.status(400).json({ message: "Invalid password", success: false });
            }
            else {
                const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: "7d" });
                res.status(200).json({ message: "User logged in", success: true, token: token });
            }
        }
    } catch (error) {
        errorHandler(error, res);
    }
}
const me = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await client.user.findFirst({ where: { id: id } });
        res.status(200).json({ message: "User found", data: user });
    } catch (error) {
        errorHandler(error, res);
    }
}
const setPhoto = async (req, res) => {
    const { id } = req.user;
    const { path } = req.file;
    try {
        const user = await client.user.update({
            where: { id: id },
            data: {
                image: path
            }
        });
        res.status(200).json({ message: "Photo set", data: user });
    } catch (error) {
        errorHandler(error, res);
    }
}
const update = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await client.user.update({
            where: { id: id },
            data: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            },
        });
        res.status(200).json({ message: "User updated", data: user });
    } catch (error) {
        errorHandler(error, res);
    }
}
const deleted = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await client.user.delete({
            where: { id: id }
        });
        fs.unlinkSync(`${user.image}`);
        res.status(200).json({ message: "User deleted", data: user });
    } catch (error) {
        errorHandler(error, res);
    }
}
export { register, login, me, setPhoto, update, deleted }