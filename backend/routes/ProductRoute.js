const express = require('express')
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProductDetails,
  createProductReview,
  getProductReviews,
  deleteProductReviews,
} = require('../controllers/ProductController')
const {
  isAuthenticatedUser,
  authorizationRoles,
} = require('../middlewere/Authentication')
const router = express.Router()

//Products APIs

router.route('/CreateNewProduct').post(createProduct)
router
  .route('/GetAllProducts')
  .get(isAuthenticatedUser, authorizationRoles('admin'), getAllProducts)
router
  .route('/GetSingleProduct/:id')
  .get(
    isAuthenticatedUser,
    authorizationRoles('admin'),
    getSingleProductDetails
  )
router
  .route('/UpdateProduct/:id')
  .put(isAuthenticatedUser, authorizationRoles('admin'), updateProduct)
router
  .route('/DeleteProduct/:id')
  .delete(isAuthenticatedUser, authorizationRoles('admin'), deleteProduct)
module.exports = router

// Reviews Router

router.route('/Review').put(isAuthenticatedUser, createProductReview)
router.route('/GetProductReviews').get(isAuthenticatedUser, getProductReviews)
router
  .route('/DeleteProductReviews')
  .delete(isAuthenticatedUser, deleteProductReviews)
