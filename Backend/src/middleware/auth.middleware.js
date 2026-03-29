const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authMiddleware(req, res, next){
    const token = req.cookies.token;

    if(!token) return res.status(404).json({ message : "Missing Token"});

    const tokenDecoded = await jwt.verify(token, process.env.JWT_SECRET);

    const userID = tokenDecoded.id;

    const isUserExists = await userModel.findOne({_id : userID});

    if(!isUserExists) return res.status(401).json({message : "User is not Authenticated!!"});

    req.user = isUserExists;

    next();
}

module.exports = authMiddleware;