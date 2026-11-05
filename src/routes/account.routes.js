const express = require("express")
const router = express.Router()
const middleware = require("../middleware/auth")
const accountController = require("../controllers/account.controller")


//protected routes for account 

router.post("/",middleware.authMiddleware, accountController.createAcccountController)
router.get("/",middleware.authMiddleware, accountController.getUserAccountsController)

router.get("/balance/:accountId",middleware.authMiddleware, accountController.getAccountBalanceController)


module.exports = router