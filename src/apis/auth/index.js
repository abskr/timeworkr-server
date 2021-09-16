import {Router} from 'express'

// import controllers
import { register, signIn, signOut, authMiddleware, requireSignIn, updateUser } from './authController.js'

// import validators
import runValidator from '../../middlewares/validators/index.js'
import { profileEditValidator, registerValidator, signInValidator } from '../../middlewares/validators/authValidators.js' 

const route = Router()

route.post("/register", registerValidator, runValidator, register)
route.post("/signin", signInValidator, runValidator, signIn)
route.put("/edit", requireSignIn, authMiddleware, profileEditValidator, runValidator, updateUser)
route.get("/signout", signOut)


route.get('/tester', (req, res) => {
  console.log(req.cookies)
  res.send("test");
});

export default route