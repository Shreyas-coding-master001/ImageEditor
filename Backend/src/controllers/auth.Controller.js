const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

async function getCurrentUser(req, res) {
  try {
    // req.user already populated by auth middleware
    const { password, ...userWithoutPassword } = req.user.toObject();
    res.json({ user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function AuthControllerRegister(req, res){
    const {username, email, password, description} = req.body;

    if(!password && !email && !username) return res.status(400).json({message : "Missing Parameter's in request.body"});

    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const isUserAlreadyExisit = await userModel.findOne({email});

        if(isUserAlreadyExisit) return res.status(422).json({message : "User already exist!!"});

        const userCreate = await userModel.create({
            username, email, password : hash, description
        });
        
        const token = await jwt.sign(
        {id : userCreate._id.toString()}, 
        process.env.JWT_SECRET, 
        {expiresIn : "1d"});
        
        res.cookie("token", token);

        res.status(201).json({
            message : "User Created Successfully",
            user: userCreate
        });
        
    }catch(err){
        res.status(500).json({
            message : "Pakka bcrpyt yafhir jwt ka problem he 😭😭",
            error : err
        })
    }
}

async function AuthControllerLogin(req, res){
    const {username, email, password} = req.body;

    try{
        const isUserExist = await userModel.findOne({
            $or :[
                {username},
                {email}
            ]
        });

        const hash = isUserExist.password;

        const isRightPassword = await bcrypt.compare(password, hash);

        if(!isUserExist) return res.status(404).json({message : "User Does not Exist's Please Login First"});

        if(!isRightPassword) return res.status(403).json({ message : "Incorrect Password!!"});

        const token = await jwt.sign(
            {id : isUserExist._id.toString()}, 
            process.env.JWT_SECRET,
        {expiresIn : "1d"});

        res.cookie("token", token);
        
        res.status(201).json({message : "User Logged in Successfully", user: isUserExist});
    }catch(err){
        res.status(500).json({
            message : "Pakka mongoDB ya fhir bcrypt or jwt ka problem he 😭😭",
            error : err
        });
    }
}

module.exports = {
    AuthControllerRegister,
    AuthControllerLogin,
    getCurrentUser
};
