const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required for creating user!"],
        trim: true,
        lowercase: true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
        unique:[true,"Email already exists!"]
    },
    name:{
        type: String,
        required: [true,"Name is required for creating a account!"]
    },
    password:{
        type:String,
        required:[true,"Password is required for creating account"],
        minlength:[6,"Password should contain more than 6 character!"],
        select:false
    }
},{timestamps:true})

const userModel = mongoose.model("User",userSchema)


module.exports = userModel