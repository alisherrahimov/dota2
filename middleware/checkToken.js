import jwt from "jsonwebtoken"

export const checkToken = (req, res, next) => {
    const bearer = req.headers["authorization"];
    if (typeof bearer !== "undefined") {
        const bearerToken = bearer.split(" ")[1];
        jwt.verify(bearerToken, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: "Invalid token" });
            }
            else {
                req.user = decoded;
                next();
            }
        });
    } else {
        res.status(403).json({ message: "Forbidden" });
    }
};