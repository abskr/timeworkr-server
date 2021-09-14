import { Router } from "express"
import { requireSignIn } from "../auth/authController.js"
import { createSheet, deleteUserSheet, downloadSheet, getAllSheetsAndRows, getUserSheetById, getUserSheets } from './sheetController.js';

// import controllers


// import validators


const route = Router()

// @route /api/sheet
route.post('/', requireSignIn, createSheet)
route.get('/', requireSignIn, getUserSheets)
route.delete('/:sheetId', requireSignIn, deleteUserSheet)
route.get('/:sheetId', requireSignIn, getUserSheetById)
route.get('/:sheetId/download', requireSignIn, downloadSheet)

export default route