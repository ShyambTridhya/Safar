const express = require('express')
const {getAllProducts} = require('../controllers/ProductController')
const router = express.Router()

router.route('/Products').get(getAllProducts)

module.exports = router
