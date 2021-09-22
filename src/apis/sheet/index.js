import { Router } from "express"
import {
  createSheet,
  deleteUserSheet,
  downloadSheet,
  getUserSheetById,
  getUserSheets,
  getUserSheetByQuery,
} from './sheetController.js';

// import controllers


// import validators


const route = Router()

// @route /api/sheet

route.get('/usersheets', getUserSheets)
route.post('/new',  createSheet)
route.get('/?', getUserSheetByQuery);
route.delete('/id/:sheetId', deleteUserSheet)
route.get('/id/:sheetId',  getUserSheetById)
route.get('/id/:sheetId/download', downloadSheet)

export default route