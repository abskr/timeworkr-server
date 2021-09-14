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
    
    console.log(req.body)
    const { date, startTime, endTime, pause, plannedTime, rate, task } = req.body

    let newRow = new RowModel({
      sheetId,
      userId,
      date,
      startTime,
      endTime,
      pause,
      plannedTime: {
        hours: plannedTime.hours,
        minutes: plannedTime.minutes,
      },
      rate: {
        per: rate.per,
        amount: rate.amount
      },
      task
    });
    const row = await newRow.save()
    const updateSheet = await SheetModel.updateSheetSum(sheetId, userId)
    res.json({
      created : {
        rowId : row._id
      },
      updated: {
        sheetId : updateSheet._id
      }
    })
} catch (error) {
    console.log(error)
    res.status(500).json({
      error
    })
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
        startTime,
        endTime,
        pause,
        plannedTime: {
          hours: plannedTime.hours,
          minutes: plannedTime.minutes,
        },
        rate: {
          per: rate.per,
          amount: rate.amount
        },
        order: {
          from: order.from,
          task: order.task,
        },
        task
      },
      { new: true, omitUndefined: true }
    );

    if(!row) {
      return res.status(404).json({
        error: 'Row not found!'
      })
    }

    const updateSheet = await SheetModel.updateSheetSum(sheetId);

    res.json({
      updated: {
        rowId: row._id,
        sheetId: updateSheet._id
      }
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
        
    const updateSheet = await SheetModel.updateSheetSum(sheetId);
    
    res.json({
      deleted: {
        rowId: row._id
      },
      updated: {
        sheetId: updateSheet._id
      }
    })
  } catch (error) {
     console.log(error);
     res.status(500).json({
       error: 'Generic server error!',
     });
  }
}

export const createRowMock = async(req, res) => {
      // const {
      //   date,
      //   startTime,
      //   endTime,
      //   pause,
      //   plannedTime,
      //   hourlyRate,
      //   order,
      // } = req.body;
  const inputArr = [
    {
      sheetId: mongoose.Types.ObjectId('612f97f03bbb3840d87b1530'),
      userId: mongoose.Types.ObjectId('612cafabf4b34e7aa45b1a49'),
      date: '2021-09-01',
      startTime: '08:00',
      endTime: '16:00',
      pause: 30,
      plannedTime: {
        hours: 8,
      },
      rate: {
        per: 'hour',
        amount: 11.5,
      },
    },
    {
      sheetId: mongoose.Types.ObjectId('612f97f03bbb3840d87b1530'),
      userId: mongoose.Types.ObjectId('612cafabf4b34e7aa45b1a49'),
      date: '2021-09-02',
      startTime: '08:00',
      endTime: '16:00',
      pause: 30,
      plannedTime: {
        hours: 8,
      },
      rate: {
        per: 'hour',
        amount: 11.5,
      },
    },
    {
      sheetId: mongoose.Types.ObjectId('612f97f03bbb3840d87b1530'),
      userId: mongoose.Types.ObjectId('612cafabf4b34e7aa45b1a49'),
      date: '2021-09-03',
      startTime: '13:00',
      endTime: '19:00',
      pause: 0,
      plannedTime: {
        hours: 5,
      },
      rate: {
        per: 'hour',
        amount: 14,
      },
    },
    {
      sheetId: mongoose.Types.ObjectId('612f97f03bbb3840d87b1530'),
      userId: mongoose.Types.ObjectId('612cafabf4b34e7aa45b1a49'),
      date: '2021-09-06',
      startTime: '13:00',
      endTime: '19:00',
      pause: 0,
      plannedTime: {
        hours: 6,
      },
      rate: {
        per: 'hour',
        amount: 14,
      },
    },
    {
      sheetId: mongoose.Types.ObjectId('612f97f03bbb3840d87b1530'),
      userId: mongoose.Types.ObjectId('612cafabf4b34e7aa45b1a49'),
      date: '2021-09-07',
      startTime: '18:00',
      endTime: '22:00',
      pause: 0,
      plannedTime: {
        hours: 4,
      },
      rate: {
        per: 'hour',
        amount: 15,
      },
    },
  ];
  try {
    const rows = await RowModel.insertMany(inputArr)
    res.json(rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Generic server error!',
    });
  }
}