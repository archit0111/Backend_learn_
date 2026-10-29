const express = require("express")
const authRouter = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")
const accountRouter = require("./routes/account.routes")
const transactionRouter = require("./routes/transaction.routes")


const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/",(req,res)=>{
    res.send("Welcome to the Ledger API. Please use the appropriate endpoints for authentication, accounts, and transactions.")
})

app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRouter)


module.exports = app