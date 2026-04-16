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

    if(!password || !email || !username) return res.status(400).json({message : "Missing required parameters: username, email, password"});

    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const isUserAlreadyExisit = await userModel.findOne({email});

        if(isUserAlreadyExisit) return res.status(422).json({message : "User already exists with this email!!"});

        const userCreate = await userModel.create({
            username, email, password : hash, description
        });
        
        const token = jwt.sign(
        {id : userCreate._id.toString()}, 
        process.env.JWT_SECRET, 
        {expiresIn : "1d"});
                // res.cookie("token", token, { httpOnly: true, secure: false, sameSite: 'lax' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,        // ✅ Required for HTTPS
            sameSite: "None"     // ✅ Required for cross-origin
        });

        res.status(201).json({
            message : "User Created Successfully",
            user: { id: userCreate._id, username, email, description }
        });
        
    }catch(err){
        console.error('Register error:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', error: err.message });
        }
        res.status(500).json({
            message : "Internal server error during registration",
            error : err.message
        })
    }
}

async function AuthControllerLogin(req, res){
    const {username, email, password} = req.body;

    if (!password || (!username && !email)) {
        return res.status(400).json({ message: 'Username/email and password required' });
    }

    try{
        const isUserExist = await userModel.findOne({
            $or :[
                {username},
                {email}
            ]
        });

        if(!isUserExist) return res.status(404).json({message : "User does not exist. Please sign up first."});

        const isRightPassword = await bcrypt.compare(password, isUserExist.password);

        if(!isRightPassword) return res.status(403).json({ message : "Incorrect password!!"});

        const token = jwt.sign(
            {id : isUserExist._id.toString()}, 
            process.env.JWT_SECRET,
            {expiresIn : "1d"});

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,        // ✅ Required for HTTPS
            sameSite: "None"     // ✅ Required for cross-origin
        });
        
        const { password: _, ...user } = isUserExist.toObject();
        res.status(200).json({message : "User logged in successfully", user});
    }catch(err){
        console.error('Login error:', err);
        res.status(500).json({
            message : "Internal server error during login",
            error : err.message
        });
    }
}

module.exports = {
    AuthControllerRegister,
    AuthControllerLogin,
    getCurrentUser
};
