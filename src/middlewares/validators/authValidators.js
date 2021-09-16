import { check } from 'express-validator'

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
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('iban').optional({checkFalsy: true}).not().isIBAN().withMessage('IBAN is not valid')
];