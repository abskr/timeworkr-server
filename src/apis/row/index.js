import { Router } from 'express';
import { authMiddleware, requireSignIn } from '../auth/authController.js';
// import controllers
import {
  createRow,
  getRow,
  editRow,
  deleteRow,
  createRowMock,
} from './rowController.js';

// import validators


const route = Router();

// @route /api/sheet
route.post('/generateRow', requireSignIn, createRowMock);
route.post('/:sheetId/row', requireSignIn, createRow);

// MODEL TESTER
// import models
import mongoose from 'mongoose'
import SheetModel from '../../models/Sheet.js'
import RowModel from '../../models/Row.js'
import Row from '../../models/Row.js';
// route.get('/:sheetId/row/test', requireSignIn, async (req, res) => {
//   const { sheetId } = req.params
//   // const matchFilter = { sheetId: mongoose.Types.ObjectId(sheetId)}
//   // const sumDuration = await RowModel.aggregate([
//   //   { $match: matchFilter },
//   //   { $group: { _id: "$sheetId", sumDuration: {$sum: "$duration"} }}
//   // ])
//   // console.log (matchFilter)
//   // console.log (sumDuration)
//   const update = await SheetModel.updateSheetSum(sheetId)
//   // console.log(update)
//   res.json({
//     message: "check console!"
//   })
// })
route.get('/row/rows', requireSignIn, authMiddleware, async (req, res) => {
  const userId = req.profile._id
  try {
    const rows = await Row.aggregate([
      {
        $match: { userId: mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: '$sheetId',
          doc: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
    ]);
    res.json(rows)
  } catch (error) {
    console.log(error)
    res.json(
      {error: 'Generic server error'}
    )
  }
})
route.get('/:sheetId/row/:rowId', requireSignIn, getRow);
route.put('/:sheetId/row/:rowId', requireSignIn, editRow);
route.delete('/:sheetId/row/:rowId', requireSignIn, deleteRow);
// route.get('/', requireSignIn, getUserSheets);
// route.get('/:sheetId', requireSignIn, getUserSheetById);



export default route;
