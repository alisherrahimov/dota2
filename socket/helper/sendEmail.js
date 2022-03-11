import nodemailer from "nodemailer"
export const sendEmail = async (email, code) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "ooops2211@gmail.com",
                pass: "alisher97raximov"
            }
        })
        let info = await transporter.sendMail({
            from: "Dota2-APP",
            to: `${email}`,
            subject: "Alisher Rakhimov",
            html: `<h1>Verification code : ${code}</h1>`
        })

        return true
    } catch (error) {
        return error
    }

}