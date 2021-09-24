import {Router} from 'express'

// import controllers
import {
  register,
  signIn,
  signOut,
  authMiddleware,
  requireSignIn,
  updateUser,
  addTemplate,
  deleteTemplate,
} from './authController.js';

// import validators
import runValidator from '../../middlewares/validators/index.js'
import { profileEditValidator, registerValidator, signInValidator, templateValidator } from '../../middlewares/validators/authValidators.js' 
import setHeader from '../../config/setHeader.js'

const route = Router()

route.post("/register", registerValidator, runValidator, register)
route.post("/signin", signInValidator, runValidator, signIn)
route.get("/signout", signOut)

route.use('/edit', setHeader);
route.put("/edit", requireSignIn, authMiddleware, profileEditValidator, runValidator, updateUser)
route.post("/edit/temp/add", requireSignIn, authMiddleware, templateValidator, runValidator, addTemplate)
route.delete("/edit/temp/id/:tempId", requireSignIn, authMiddleware, deleteTemplate)


route.get('/tester', (req, res) => {
  console.log(req.cookies)
  res.send("test");
});

export default route