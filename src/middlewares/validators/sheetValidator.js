import { check } from 'express-validator';

export const sheetValidator = [
  check('month').isEmpty().withMessage('Month input is required'),
  check('year').isEmpty().withMessage('Year input is required'),
];
