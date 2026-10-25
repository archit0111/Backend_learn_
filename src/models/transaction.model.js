const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required: [true,"Transaction must be assosiated with a from account"],
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required: [true,"Transaction must be assosiated with a to account"],
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Satus can be either pending, completed, failed or reversed."
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a transaction."],
        min:[0,"Transaction amount can't be negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"Idempotency key is required fro creating a transaction."],
        unique:true,
        index:true
    }
},{timestamps:true})

const transactionModel = mongoose.model("transaction",transactionSchema)

module.exports = transactionModel