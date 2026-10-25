const accountModel = require('../models/account.model');
const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const mongoose = require('mongoose');
const userModel = require('../models/user.model');

async function createTransaction(req, res) {

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({ message: "Missing required fields" });
    }

    const fromUserAccount = await accountModel.findOne({ _id: fromAccount});
    const toUserAccount = await accountModel.findOne({_id:toAccount});

    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({ message: "One or both accounts not found" });
    }


    const transactionExists = await transactionModel.findOne({ idempotencyKey:idempotencyKey });

    if (transactionExists) {
        if(transactionExists.status === "COMPLETED"){
            return res.status(200).json({ message: "Transaction already completed", transaction: transactionExists });
        }
        if(transactionExists.status === "PENDING"){
            return res.status(200).json({ message: "Transaction is still pending", transaction: transactionExists });
        }
        if(transactionExists.status === "FAILED"){
            return res.status(200).json({ message: "Transaction has failed", transaction: transactionExists });
        }
        if(transactionExists.status === "REVERSED"){
            return res.status(200).json({ message: "Transaction has been reversed", transaction: transactionExists });
        }   
    }


    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({ message: "One or both accounts are not active" });
    }

    //aggregate the balance of the fromUserAccount

    const balance = await fromUserAccount.getBalance();

    if(balance<amount){
        return res.status(400).json({ message: "Insufficient balance in the from account" });
    }

    // Log the balance of the from account

    console.log("Balance in from account:", balance); 

    const createTransaction = await transactionModel.create([{
        fromAccount,
        toAccount, 
        amount, 
        idempotencyKey,
        status:"PENDING"
    }]);

    if(!createTransaction || createTransaction.length === 0) {
        return res.status(500).json({ message: "Failed to create transaction" });
    }

    //create a session for transaction

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModel.findOne({idempotencyKey : idempotencyKey}).session(session);

    const debitLedgerEntry = await ledgerModel.create([{account: fromAccount, amount:amount, transaction: transaction._id, type:"DEBIT"}],{session});

    await (()=>{
        return new Promise((resolve)=> setTimeout(resolve,1000 * 20))
    })();

    const creditLedgerEntry = await ledgerModel.create([{account: toAccount, amount:amount, transaction: transaction._id, type:"CREDIT"}],{session});

    if(!creditLedgerEntry || !debitLedgerEntry){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Failed to create ledger entry for credit or debit" });
    }

    await transactionModel.findByIdAndUpdate(transaction._id, { status: "COMPLETED" }, { session });
    await transaction.save({session});

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({message:"Transaction completed successfully", transaction:transaction})
}







async function createInitialFundsTransaction(req,res){
    const {toAccount, amount, idempotencyKey} = req.body;

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({ message: "Missing required fields" });
    }

    const toUserAccount = await accountModel.findOne({_id:toAccount});

    if (!toUserAccount) {
        return res.status(404).json({ message: "Account not found" });
    }
    
    // console.log("User ID from request:", req.user._id); // Log the user ID from the request
    // console.log( toUserAccount); // Log the user ID from the token
    // console.log("Searching for System: true AND ID:", req.user._id);


    const fromUserAccount = await userModel.findOne({
        system: true,
        _id: req.user._id
    });

    // console.log("System Account:", fromUserAccount); // Log the system account details

    if(!fromUserAccount){
        return res.status(404).json({ message: "System account not found" });
    }

    const transactionExists = await transactionModel.findOne({ idempotencyKey:idempotencyKey });
    if (transactionExists) {
        if(transactionExists.status === "COMPLETED"){
            return res.status(200).json({ message: "Transaction already completed", transaction: transactionExists });
        }
        if(transactionExists.status === "PENDING"){
            return res.status(200).json({ message: "Transaction is still pending", transaction: transactionExists });
        }
        if(transactionExists.status === "FAILED"){
            return res.status(200).json({ message: "Transaction has failed", transaction: transactionExists });
        }
        if(transactionExists.status === "REVERSED"){
            return res.status(200).json({ message: "Transaction has been reversed", transaction: transactionExists });
        }
    }

    if(toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({ message: "Account is not active" });
    }

    const createTransaction = await transactionModel.create([{
        fromAccount,
        toAccount, 
        amount, 
        idempotencyKey,
        status:"PENDING"
    }]);

    if(!createTransaction || createTransaction.length === 0) {
        return res.status(500).json({ message: "Failed to create transaction" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModel.findOne({idempotencyKey : idempotencyKey}).session(session);

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount:amount,
        transaction: transaction._id,
        type:"DEBIT"
    }],{session});

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount:amount,
        transaction: transaction._id,
        type:"CREDIT"
    }],{session});

    if(!creditLedgerEntry || !debitLedgerEntry){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Failed to create ledger entry for credit or debit" });
    }

    await transactionModel.findByIdAndUpdate(transaction._id, { status: "COMPLETED" }, { session });
    await transaction.save({session});

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({message:"Initial funds transaction completed successfully", transaction:transaction})

}


module.exports = {
    createTransaction,
    createInitialFundsTransaction
}