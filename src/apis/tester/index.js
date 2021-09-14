import { Router } from 'express';
import { requireSignIn } from '../auth/authController.js';
import {
  createSheet
} from './testerController.js';

const route = Router();

// @route /api/tester
route.post('/', requireSignIn, createSheet);
// route.get('/', requireSignIn, getUserSheets);
// route.delete('/:sheetId', requireSignIn, deleteUserSheet);
// route.get('/:sheetId', requireSignIn, getUserSheetById);
// route.get('/:sheetId/download', requireSignIn, downloadSheet);

export default route;
