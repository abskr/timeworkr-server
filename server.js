import express from 'express'
import listEndpoints from 'express-list-endpoints'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// import routes
import authRoutes from './src/apis/auth/index.js'
import sheetRoutes from './src/apis/sheet/index.js'
import rowRoutes from './src/apis/row/index.js'
import { requireSignIn } from '/users/abskr/documents/studium/strive/timeworkr/server/src/apis/auth/authcontroller.js'
import { authMiddleware } from './src/apis/auth/authController.js'
// import testerRoutes from './src/apis/tester/index.js'

const server = express()

// connect to db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(listEndpoints(server))
    console.log("db connection successful!")})
  .catch((err) => {
    console.log(err.message)
  })

// middleware
server.use(morgan('dev'))
server.use(bodyParser.json())
server.use(cookieParser())

// cors
const whitelist = [process.env.FE_DEV, process.env.FE_PROD];
const corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    if(whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

server.use(cors(corsOptions))

// add headers
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FE_DEV || process.env.FE_PROD);
  res.setHeader('Access-Control-Allow-Credentials', true);
  next()
})


// routes
server.use("/api/auth", authRoutes)
server.use("/api/sheet", requireSignIn, authMiddleware, sheetRoutes)
server.use('/api/sheet', requireSignIn, authMiddleware, rowRoutes);
// server.use("/api/tester", testerRoutes)

// port
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});