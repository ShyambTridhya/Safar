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
  const apiFeatures = new ApiFeatures(Product.find(), req.query).search()
  const products = await apiFeatures.query

  res.status(200).json({
    success: true,
    products,
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
