const userModel= require("../models/user.model");
const jwt = require("jsonwebtoken");


async function authMiddleware(req,res,next){
    const token = req.cookies.token;
    console.log(token);

    if (!token){
        return res.status(401).json({message:"Unauthorized access, token missing!"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);
        req.user =user
        next()

    }catch(e){
        return res.status(401).json({message:"Token is Invalid"});
    }
}

module.exports = {authMiddleware}