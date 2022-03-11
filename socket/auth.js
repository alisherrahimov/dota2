import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "./helper/sendEmail";
const client = new PrismaClient();
export const register = async (io, data) => {
    const { username, email, password } = data;

    try {
        if (!username || !email || !password) {
            return io.emit("register", {
                data: "Please fill all fields",
                success: false,
            });
        }
        const user = await client.user.findFirst({
            where: {
                email: email,
            },
        });
        if (user) {
            return io.emit("register", {
                data: "User already exists",
                success: false,
            });
        }
        const hash = bcrypt.hashSync(password, 10);

        const newUser = await client.user.create({
            data: {
                username: username,
                email: email,
                password: hash,
            },
        });
        return io.emit("register", {
            success: true,
            data: newUser,
        });
    } catch (error) {
        return io.emit("register", {
            data: error,
            success: false,
        });
    }
};
export const login = async (io, data) => {
    const { email, password } = data;

    try {
        if (!email || !password) {
            return io.emit("login", {
                data: "Please fill all fields",
                success: false,
            });
        }

        const user = await client.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!user) {
            return io.emit("login", {
                data: "User does not exist",
                success: false,
            });
        }
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            io.emit("login", {
                data: "Invalid password",
                success: false,
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
            },
            process.env.SECRET,
            {
                expiresIn: "365d",
            }
        );
        return io.emit("login", {
            message: "User logged in",
            success: true,
            token: token,
        });
    } catch (error) {
        io.emit("login", {
            data: error,
            success: false,
        });
    }
};
export const createComment = async (io, data) => {
    const { id } = data.id;
    const { content, movie_id } = data.body;
    try {
        const comment = await client.comment.create({
            data: {
                content: content,
                user_id: id,
                movies_id: movie_id,
                author: {
                    connect: {
                        id,
                    },
                },
            },
        });

        io.emit("create_comment", {
            message: "comment wrote",
        });
    } catch (error) {
        io.emit("create_comment", {
            message: "comment not wrote",
        });
    }
};
export const getAllComment = async (io, data) => {
    const id = data.id;
    try {
        const comment = await client.comment.findMany({
            where: {
                movies_id: id,
            },
            include: {
                author: true,
            },
        });
        io.emit("get_all_comment", {
            comment,
        });
    } catch (error) {
        io.emit("get_all_comment", {
            message: "comment not wrote",
        });
    }
};
export const recoveryPassword = async (io, data) => {
    const { email } = data;
    try {
        if (!email) {
            return io.emit("recovery_password", {
                data: "Please fill all fields",
                success: false,
            });
        }
        const user = await client.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!user) {
            return io.emit("recovery_password", {
                data: "User does not exist",
                success: false,
            });
        }
        const generateCode = Math.floor(Math.random() * 100000);
        console.log(generateCode)
        sendEmail(email, generateCode).then(() => {
            client.user.update({
                where: {
                    email: email,
                },
                data: {
                    verificationCode: { set: generateCode },
                }
            }).then(() => {
                io.emit("recovery_password", {
                    data: "Email sent",
                    success: true,
                });
            }).catch((err) => {
                console.log(err)
            })
        }).catch(() => {
            io.emit("recovery_password", {
                data: "Email not sent",
                success: false,
            });
        });
    } catch (error) {
        io.emit("recovery_password", {
            message: "User not found",
            success: false,
        });
    }
}
export const verifyCode = async (io, data) => {
    const { code, email } = data;
    try {
        if (!code || !email) {
            return io.emit("verify_code", {
                data: "Please fill all fields",
                success: false,
            });
        }
        const user = await client.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!user) {
            return io.emit("verify_code", {
                data: "User does not exist",
                success: false,
            });
        }
        if (user.verificationCode == code) {
            return io.emit("verify_code", {
                data: "Code is correct",
                success: true,
            });
        }
        return io.emit("verify_code", {
            data: "Code is incorrect",
            success: false,
        });
    } catch (error) {
        io.emit("verify_code", {
            data: error,
            success: false,
        });
    }

}
export const changePassword = async (io, data) => {
    const { email, password } = data;
    try {
        if (!password) {
            return io.emit("change_password", {
                data: "Please fill all fields",
                success: false,
            });
        }
        const hash = bcrypt.hashSync(password, 10);
        await client.user.update({
            where: {
                email: email
            },
            data: {
                password: hash
            }
        })
        return io.emit("change_password", {
            data: "Password changed",
            success: true,
        });
    } catch (error) {
        io.emit("change_password", {
            data: error,
            success: false,
        });
    }
}