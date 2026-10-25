const accountModel = require("../models/account.model");

async function createAcccountController(req,res){
    const user = req.user

    const account = await accountModel.create({
        user : user._id
    })

    res.status(201).json(account)
}

module.exports = {createAcccountController}