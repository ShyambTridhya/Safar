const express = require('express')
const {getAllProducts} = require('../controllers/ProductController')
const {
  isAuthenticatedUser,
  authorizationRoles,
} = require('../middlewere/Authentication')
const router = express.Router()

router
  .route('/Products')
  .get(isAuthenticatedUser, authorizationRoles('admin'), getAllProducts)

module.exports = router
