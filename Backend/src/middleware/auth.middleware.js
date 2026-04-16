const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authMiddleware(req, res, next){
    try {
        const token = req.cookies.token;

        if(!token) return res.status(401).json({ message : "Access denied. No token provided." });

        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

        const userID = tokenDecoded.id;

        const isUserExists = await userModel.findOne({_id : userID});

        if(!isUserExists) return res.status(401).json({message : "Invalid token. User not found." });

        req.user = isUserExists;

        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(401).json({ message: 'Invalid token', error: err.message });
    }
}

module.exports = authMiddleware;