const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')
//config
dotenv.config({path: 'backend/config/config.env'})

//ConnectDatabse
connectDatabase()

app.listen(process.env.PORT, () => {
  console.log(`server is listening on http://localhost:${process.env.PORT}`)
})
