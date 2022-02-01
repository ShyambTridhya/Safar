const User = require('../models/UserModel')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middlewere/CatchAsyncError')
const sendToken = require('../utils/JwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

//Register User

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const {name, email, password} = req.body
  const user = await User.create({
    name: name,
    email: email,
    password: password,
    profile_picture: {
      public_id: 'this is a sample id',
      url: 'profilepicUrl',
    },
  })

  sendToken(user, 201, res)
})

//Login User

exports.loginUser = async (req, res, next) => {
  const {email, password} = req.body

  // Checking is user has given password and email both

  if (!email || !password) {
    return next(
      new ErrorHandler('Please enter a valid email and password', 400)
    )
  }
  const user = await User.findOne({email}).select('+password')

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401))
  }

  const passwordMatched = await user.comparePassword(password)

  if (!passwordMatched) {
    return next(new Error('Invalid email or password', 401))
  }

  sendToken(user, 200, res)
}

//Logout the User

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    hhtpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: 'User has been logged out',
  })
})

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email})
  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  //Get ResetPassword Token
  const resetToken = user.generateResetPasswordToken()

  await user.save({validateBeforeSave: false})

  const resetPasswordUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/Password/UserResetPassword/${resetToken}`

  const message = `Your reset password link is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this email then, please ignore it😊`

  try {
    await sendEmail({
      email: user.email,
      subject: `Safar password recovery`,
      message,
    })
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully!`,
    })
  } catch (err) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpirationDate = undefined

    await user.save({validateBeforeSave: false})

    // eslint-disable-next-line no-undef
    return next(new ErrorHandler(error.message, 500))
  }
})

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpirationDate: {$gte: Date.now()},
  })
  if (!user) {
    return next(
      new ErrorHandler(
        'Reset password token is invalid or has been expired',
        400
      )
    )
  }
  console.log(req.body)
  if (req.body.password !== req.body.confirmpassword) {
    return next(new ErrorHandler('Password does not match', 400))
  }
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpirationDate = undefined

  await user.save()

  sendToken(user, 200, res)
})

//Get Login User Details

exports.getLoginUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    user,
  })
})

//Change password for Logged in user

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  const ispasswordMatched = await user.comparePassword(req.body.oldPassword)

  if (!ispasswordMatched) {
    return next(new Error('Password does not match with old password', 401))
  }

  if (req.body.newPassword !== req.body.confirmpassword) {
    return next(
      new Error('New Password does not match with Confirm Password', 401)
    )
  }

  user.password = req.body.newPassword
  await user.save()

  sendToken(user, 200, res)
})

//Update LoggedIn User Profile
exports.updateLoggedInUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUpdateUserProfileData = {
    name: req.body.name,
    email: req.body.email,
  }

  // For Avtar edit add cloudinary later

  const user = await User.findByIdAndUpdate(
    req.user.id,
    newUpdateUserProfileData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  )

  res.status(200).json({
    success: true,
    user,
  })
})

//Get All Users From Database (Admin only)

exports.getAllUsersByAdmin = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    success: true,
    users,
  })
})

//Get Single Users From Database (Admin only)

exports.getSingleUserByAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    user,
  })
})

//User Role Update (Admin only)
exports.updateUserRoleByAdmin = catchAsyncErrors(async (req, res, next) => {
  const newUpdateUserProfileData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    newUpdateUserProfileData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  )
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    )
  }
  res.status(200).json({
    success: true,
    user,
  })
})

//User delete by Admin (Admin Only)
exports.deleteUserByAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    )
  }
  await user.remove()
  res.status(200).json({
    success: true,
    message: 'User removed successfully',
  })
})
