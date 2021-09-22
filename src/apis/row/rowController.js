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
    
    const { date, startTime, endTime, pause, plannedTime, rate, task } = req.body

    let newRow = new RowModel({
      sheetId,
      userId,
      date,
      startTime: {
        hour: startTime.hour,
        minute: startTime.minute,
      },
      endTime: {
        hour: endTime.hour,
        minute: endTime.minute,
      },
      pause,
      plannedTime: {
        hours: plannedTime.hours,
        minutes: plannedTime.minutes,
      },
      rate: {
        per: rate.per,
        amount: rate.amount,
      },
      task,
    });
    console.log(newRow)
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

    const {
      date,
      startTime,
      endTime,
      pause,
      plannedTime,
      rate,
      order,
      task
    } = req.body;

    
    const row = await RowModel.findOneAndUpdate(
      { _id: rowId, sheetId, userId },
      {
        date,
        startTime: {
          hour: startTime.hour,
          minute: startTime.minute,
        },
        endTime: {
          hour: endTime.hour,
          minute: endTime.minute,
        },
        pause,
        plannedTime: {
          hours: plannedTime.hours,
          minutes: plannedTime.minutes,
        },
        rate: {
          per: rate.per,
          amount: rate.amount,
        },
        order: {
          from: order.from,
          task: order.task,
        },
        task,
      },
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