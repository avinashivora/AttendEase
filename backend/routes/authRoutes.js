const express = require('express')
const { register, login, updatePassword, serverLive, generateOtpForForgotPassword, resetPasswordByOtp } = require('../controllers/userControllers')
const verifyUser = require("../middleware/userAuthMiddleware")//I feel there is no use of this
const router = express.Router()

// apis
router.post('/register', register)
router.post('/login', login)
router.patch('/update-password/:email', updatePassword)
router.get('/server-live', serverLive)
router.patch('/generate-otp-for-password', generateOtpForForgotPassword)
router.patch("/reset-password-by-otp", resetPasswordByOtp)

module.exports = router