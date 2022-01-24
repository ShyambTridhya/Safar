const express = require('express')
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/UserController')
const router = express.Router()

router.route('/UserRegister').post(registerUser)
router.route('/UserLogin').post(loginUser)
router.route('/Password//UserForgotPassword').post(forgotPassword)
router.route('/Password/UserResetPassword/:token').put(resetPassword)
router.route('/UserLogout').get(logout)

module.exports = router
