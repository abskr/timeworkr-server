import { Router } from 'express';

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
route.post('/id/:sheetId/row/new', rowValidator, runValidator, createRow);

route.get('/id/:sheetId/row/id/:rowId', getRow);
route.put(
  '/id/:sheetId/row/id/:rowId',
  rowValidator,
  runValidator,
  editRow
);
route.delete('/id/:sheetId/row/id/:rowId', deleteRow);



export default route;
