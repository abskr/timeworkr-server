import { validationResult } from "express-validator"

const runValidator = (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json(errors)
  }
  next()
}

export default runValidator