import jwt from "jsonwebtoken"
import express from "express"


function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: `Invalid token or no token` })
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: "Invalid Token" })
        }

        req.userId = decoded.id;
        next();
    })

}
export default authMiddleware