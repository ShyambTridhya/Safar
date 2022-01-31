const express = require('express')
const app = express()
const errorMiddleware = require('./middlewere/Error')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//App Use

app.use(express.json())
app.use(cookieParser())
app.use(cors())

//Routes Imports
const product = require('./routes/ProductRoute')
const user = require('./routes/UserRoute')

app.use('/api/v1', product)
app.use('/api/v1', user)

//Middleware for Errors
app.use(errorMiddleware)

module.exports = app
