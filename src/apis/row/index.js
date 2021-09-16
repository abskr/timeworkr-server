import { Router } from 'express';
import { authMiddleware, requireSignIn } from '../auth/authController.js';
// import controllers
import {
  createRow,
  getRow,
  editRow,
  deleteRow,
} from './rowController.js';

// import validators
import runValidator from '../../middlewares/validators/index.js';
import { rowValidator } from '../../middlewares/validators/rowValidator.js';


const route = Router();

// @route /api/sheet
// route.post('/generateRow', requireSignIn, createRowMock);
route.post('/:sheetId/row', requireSignIn, authMiddleware, rowValidator, runValidator, createRow);

// MODEL TESTER
// import models
import mongoose from 'mongoose'
import SheetModel from '../../models/Sheet.js'
import RowModel from '../../models/Row.js'
import Row from '../../models/Row.js';

route.get('/:sheetId/row/:rowId', requireSignIn, authMiddleware, getRow);
route.put(
  '/:sheetId/row/:rowId',
  requireSignIn,
  authMiddleware,
  rowValidator,
  runValidator,
  editRow
);
route.delete('/:sheetId/row/:rowId', requireSignIn, authMiddleware, deleteRow);
// route.get('/', requireSignIn, getUserSheets);
// route.get('/:sheetId', requireSignIn, getUserSheetById);



export default route;
