import { Router } from "express"
import { authMiddleware, requireSignIn } from '../auth/authController.js';
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
route.get('/', requireSignIn, getUserSheets)
route.post('/', requireSignIn, authMiddleware, createSheet)
route.get('/?', requireSignIn, authMiddleware, getUserSheetByQuery);

route.delete('/:sheetId', requireSignIn, authMiddleware, deleteUserSheet)
route.get('/:sheetId', requireSignIn, authMiddleware, getUserSheetById)
route.get('/:sheetId/download', requireSignIn, authMiddleware, downloadSheet)

export default route