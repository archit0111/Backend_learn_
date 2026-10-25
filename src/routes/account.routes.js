const express = require("express")
const router = express.Router()
const middleware = require("../middleware/auth")
const { createAcccountController } = require("../controllers/account.controller")



router.post("/",middleware.authMiddleware, createAcccountController)



module.exports = router