const Product = require('../models/ProductModel')
const catchAsyncErrors = require('../middlewere/CatchAsyncError')
const ErrorHandler = require('../utils/ErrorHandler')
const ApiFeatures = require('../utils/apiFeatures')

//Create a new Product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body)
  res.status(201).json({
    success: true,
    product,
  })
})

//Get All products from Database
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 5
  const productCounts = await Product.countDocuments()
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
  const products = await apiFeatures.query

  res.status(200).json({
    success: true,
    products,
    productCounts,
  })
})

//Get Single product Details
exports.getSingleProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    return next(
      new ErrorHandler(`Product Not Found with id:${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    product,
  })
})

//Update the product (Only Admin Update the Product)
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) {
    return next(
      new ErrorHandler(`Product Not Found with id:${req.params.id}`, 404)
    )
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    product,
  })
})

//Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    return next(
      new ErrorHandler(`Product Not Found with id:${req.params.id}`, 404)
    )
  }

  await product.remove()

  res.status(200).json({
    success: true,
    message: 'Product removed successfully',
  })
})

// Create review or update Review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const {rating, comments, productId} = req.body

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comments,
  }

  const product = await Product.findById(productId)

  const isReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  )
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.rating = rating
        review.comments = comments
      }
    })
  } else {
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
  }

  let avrageRating = 0

  product.reviews.forEach((review) => {
    avrageRating = avrageRating + review.rating
  })

  product.ratings = avrageRating / product.reviews.length

  await product.save({validateBeforeSave: false})

  res.status(200).json({
    success: true,
  })
})

//Get all reviews of product

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId)

  if (!product) {
    return next(new ErrorHandler('Product Not Found', 404))
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  })
})

//Delete Product reviews

exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId)

  if (!product) {
    return next(new ErrorHandler('Product not found', 404))
  }

  const reviews = product.reviews.filter(
    (review) => review._id.toString !== req.query.id.toString() // Same id will be deleted
  )

  let avrageRating = 0

  reviews.forEach((review) => {
    avrageRating = avrageRating + review.rating
  })

  const ratings = avrageRating / reviews.length

  const numofReviews = reviews.length

  await Product.findByIdAndUpdate(
    req.query.procutId,
    {
      reviews,
      ratings,
      numofReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  )

  res.status(200).json({
    success: true,
  })
})
