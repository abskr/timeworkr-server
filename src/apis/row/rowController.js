import SheetModel from '../../models/Sheet.js'
import RowModel from '../../models/Row.js'
import mongoose from 'mongoose'

export const createRow = async(req, res) => {
  const userId = req.user._id;
  const {sheetId} = req.params
  try {
    const sheet = await SheetModel.findById(sheetId);
    if (!sheet) {
      return res.status(404).json({
        error: 'No sheet found!',
      });
    }
    if (!sheet.userId.equals(userId)) {
      return res.status(403).json({
        error: 'Action forbidden!',
      });
    }
    
    const inputs = req.body
    inputs.userId = userId
    inputs.sheetId = sheetId

    let newRow = new RowModel(inputs);
    const row = await newRow.save()
    res.json({
        row
    })
} catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Generic server error!',
    }); 
  }
}

export const getRow = async(req, res) => {
  const userId = req.user._id;
  const { sheetId, rowId } = req.params;
  try {
    const sheet = await SheetModel.findById(sheetId);
    if (!sheet) {
      return res.status(404).json({
        error: 'No sheet found!',
      });
    }
    if (!sheet.userId.equals(userId)) {
      return res.status(403).json({
        error: 'Action forbidden!',
      });
    }

    const row = await RowModel.findById(rowId)
    if (!row) {
      return res.status(404).json({
        error: 'No row found!',
      });
    }

    res.json({
      row
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Generic server error!',
    });    
  }
}

export const editRow = async(req, res) => {
  const userId = req.user._id
  const { sheetId, rowId } = req.params
  try {
    const sheet = await SheetModel.findById(sheetId);
    if (!sheet) {
      return res.status(404).json({
        error: 'No sheet found!',
      });
    }
    if (!sheet.userId.equals(userId)) {
      return res.status(403).json({
        error: 'Action forbidden!',
      });
    }

    const inputs = req.body;

    
    const row = await RowModel.findOneAndUpdate(
      { _id: rowId, sheetId, userId },
      inputs,
      { new: true, omitUndefined: true }
    );

    if(!row) {
      return res.status(404).json({
        error: 'Row not found!'
      })
    }

    res.json({
      row
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Generic server error!'
    })
  }
}

export const deleteRow = async(req, res) => {
  const userId = req.user._id;
  const { sheetId, rowId } = req.params;
  try {
    const sheet = await SheetModel.findById(sheetId);
    if (!sheet) {
      return res.status(404).json({
        error: 'No sheet found!',
      });
    }
    if (!sheet.userId.equals(userId)) {
      return res.status(403).json({
        error: 'Action forbidden!',
      });
    }

    const row = await RowModel.findOneAndDelete(
      { _id: rowId, sheetId },
    )
    if (!row) {
      return res.status(404).json({
        error: 'Row not found!',
      });
    }
    
    res.json({
     row
    })
  } catch (error) {
     console.log(error);
     res.status(500).json({
       error: 'Generic server error!',
     });
  }
}