import { body, check } from 'express-validator'

export const rowValidator = [
  check('date').isEmpty().withMessage('Date input is required'),
  check('startTime').isEmpty().withMessage('This input is required'),
  check('endTime').isEmpty().withMessage('This input is required')
]