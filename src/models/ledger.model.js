const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger must be assosiated with an account"],
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a ledger entry."],
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Ledger must be associated with a transaction"],
        immutable:true
    },
    type:{
        type:String,
        enums:{
            values:["CREDIT","DEBIT"],
            message:"Type can either CREDIT or DEBIT"
        },
        required:[true,"Ledger type is required"],
        immutable:true
    }
},{timestamps:true})

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified.");
}

ledgerSchema.pre("findOneAndUpdate",preventLedgerModification)
ledgerSchema.pre("updateOne",preventLedgerModification)
ledgerSchema.pre("findByIdAndUpdate",preventLedgerModification)
ledgerSchema.pre("updateMany",preventLedgerModification)
ledgerSchema.pre("deleteOne",preventLedgerModification)
ledgerSchema.pre("deleteMany",preventLedgerModification)

const ledgerModel = mongoose.model("ledger",ledgerSchema)

module.exports = ledgerModel

