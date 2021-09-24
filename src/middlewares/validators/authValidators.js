import { check } from 'express-validator'
import UserModel from '../../models/User.js'

export const registerValidator = [
  check("firstName").not().isEmpty().withMessage("First name is required!"),
  check("lastName").not().isEmpty().withMessage("Last name is required!"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars")
]

export const signInValidator = [
  check('email').isEmail().withMessage('Input a valid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 chars'),
];

export const profileEditValidator = [
  check('firstName').not().isEmpty().withMessage('First name is required!'),
  check('lastName').not().isEmpty().withMessage('Last name is required!'),
  check('email').isEmail().withMessage('Must be a valid email address')
];

export const templateValidator = [
  check('tempName')
    .custom(async (input, {req}) => {
      try {
        const userId = req.user._id
        const user = await UserModel.findById(userId)
        if (user.templates.some((temp) => temp.tempName === input)) {
          return Promise.reject('Template name must be unique')
        } else {
          return true
        }
      } catch (error) {
        console.log(error)
        return Promise.reject('Generic server error')
      }
    }),
  check('startTime').notEmpty().withMessage('This input is required!')
]