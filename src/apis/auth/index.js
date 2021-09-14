import {Router} from 'express'

// import controllers
import { register, signIn, signOut, authMiddleware, requireSignIn } from './authController.js'

// import validators
import runValidator from '../../middlewares/validators/index.js'
import { registerValidator, signInValidator } from '../../middlewares/validators/authValidators.js' 

const route = Router()

route.post("/register", registerValidator, runValidator, register)
route.post("/signin", signInValidator, runValidator, signIn)
route.get("/signout", signOut)

// test
route.get("/rahasia", requireSignIn, (req, res) => {
  res.json({
    user: req.user
  })
})

route.get('/tester', (req, res) => {
  console.log(req.cookies)
  res.send("test");
});

export default route