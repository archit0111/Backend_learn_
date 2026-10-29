const express = require("express")
const controllers = require("../controllers/auth.controller")
const router = express.Router()


router.post("/register",controllers.userRegisterController)

router.post("/login",controllers.userLoginController)

router.post("/logout",controllers.userLogoutController)

module.exports = router