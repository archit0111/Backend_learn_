const userModel= require("../models/user.model");
const jwt = require("jsonwebtoken");


async function authMiddleware(req,res,next){
    const token = req.cookies.token;

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

async function authSysUserMiddleware(req,res,next){
    const token = req.cookies.token;

    if (!token){
        return res.status(401).json({message:"Unauthorized access, token missing!"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("+system");
        if(!user.system){
            return res.status(403).json({message:"Forbidden access, user is not a system user!"});
        }
        console.log("User in tokeen :", user); // Log the user ID from the request
        req.user =user
        next();

        
    }catch(e){
        return res.status(401).json({message:"Token is Invalid"});
    }
}

module.exports = {authMiddleware, authSysUserMiddleware}