const {Router} = require('express');
const middleware = require('../middleware/auth');
const transactionController = require('../controllers/transaction.controller');

const router = Router();

router.post("/",middleware.authMiddleware,transactionController.createTransaction);

router.post("/sys/initial-funds",middleware.authSysUserMiddleware,transactionController.createInitialFundsTransaction);

module.exports = router;