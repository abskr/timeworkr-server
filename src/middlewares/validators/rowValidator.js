import { body, check } from 'express-validator'
import SheetModel from '../../models/Sheet.js'
import moment from 'moment'

export const rowValidator = [
  check('date')
    .notEmpty().withMessage('Date input is required')
    .custom(async (input, {req}) => {
      try {
        const { sheetId } = req.params
        const sheet = await SheetModel.findById(sheetId)
        const validDate = moment(`${sheet.year}-${sheet.month}-${input}`, 'YYYY-M-D').isValid()
        if (!validDate) {
          return Promise.reject('Date is invalid!')
        }
        else {
          return true
        }
        
      } catch (error) {
        console.log(error)
        return Promise.reject('Generic server error')
      }
    }),
  check('startTime').notEmpty().withMessage('This input is required'),
  check('endTime').notEmpty().withMessage('This input is required')
]