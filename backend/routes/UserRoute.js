const express = require('express')
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getLoginUserDetails,
  updatePassword,
  updateLoggedInUserProfile,
  getAllUsersByAdmin,
  getSingleUserByAdmin,
  updateUserRoleByAdmin,
  deleteUserByAdmin,
} = require('../controllers/UserController')
const {
  isAuthenticatedUser,
  authorizationRoles,
} = require('../middlewere/Authentication')
const router = express.Router()

//Authentication
router.route('/UserRegister').post(registerUser)
router.route('/UserLogin').post(loginUser)
router.route('/Password//UserForgotPassword').post(forgotPassword)
router.route('/Password/UserResetPassword/:token').put(resetPassword)
router.route('/UserLogout').get(logout)

//User routes (For Logged in user)
router
  .route('/GetLoginUserDetails')
  .get(isAuthenticatedUser, getLoginUserDetails)
router
  .route('/UpdateLoggedInUserPassword')
  .patch(isAuthenticatedUser, updatePassword)
router
  .route('/UpdateLoggedInUserProfile')
  .patch(isAuthenticatedUser, updateLoggedInUserProfile)

//Admin Routes
router
  .route('/GetAllUsersByAdmin')
  .get(isAuthenticatedUser, authorizationRoles('admin'), getAllUsersByAdmin)
router
  .route('/GetSingleUserByAdmin/:id')
  .get(isAuthenticatedUser, authorizationRoles('admin'), getSingleUserByAdmin)
router
  .route('/UpdateUserRoleByAdmin/:id')
  .patch(
    isAuthenticatedUser,
    authorizationRoles('admin'),
    updateUserRoleByAdmin
  )
router
  .route('/DeleteUserByAdmin/:id')
  .delete(isAuthenticatedUser, authorizationRoles('admin'), deleteUserByAdmin)

module.exports = router
