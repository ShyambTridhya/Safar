const User = require('../models/UserModel')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middlewere/CatchAsyncError')
const sendToken = require('../utils/JwtToken')
const CatchAsyncError = require('../middlewere/CatchAsyncError')
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
exports.forgotPassword = CatchAsyncError(async (req, res, next) => {
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
  if (req.body.password !== req.body.confirmpassword) {
    return next(new ErrorHandler('Password does not match', 400))
  }
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpirationDate = undefined

  await user.save()

  sendToken(user, 200, res)
})
