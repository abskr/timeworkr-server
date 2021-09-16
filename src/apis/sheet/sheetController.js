import SheetModel from '../../models/Sheet.js'
import RowModel from '../../models/Row.js'
import moment from 'moment'
import Excel from 'exceljs'
import mongoose from 'mongoose'
import q2m from 'query-to-mongo'
// const ObjectId = require('mongoose').Types.ObjectId;

const isValidOId = (objId) => {
  if (mongoose.Types.ObjectId.isValid(objId)) {
    if (String(new mongoose.Types.ObjectId(objId)) === objId) return true;
    return false;
  }
  return false;
};

export const createSheet = async (req, res) => {
  const userId = req.user._id
  const { month, year } = req.body
  try {
    const sheetExisted = await SheetModel.findOne({ userId, month, year })
    if (sheetExisted) {
      return res.status(400).json({
        error: 'Sheet for this month is already existed!'
      })
    }
    let newSheet = new SheetModel({ userId, month, year})
    const sheet = await newSheet.save()
    res.json({
      sheet
    })
    
  } catch (error) {
    res.status(500).json({
      error: 'Generic server error!',
    });  
  }}

export const getUserSheets = async (req, res) => {
  const userId = req.user._id
  try {
    const sheets = await SheetModel
      .find({ userId })
      .sort({
        year: 1,
        month: 1
      })
    
    if (!sheets) {
      return res.status(404).json({
        error: "no sheets found!"
      })
    }

    res.json({
      sheets
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Generic server error!',
    });  
  }
}

export const getUserSheetByQuery = async (req, res) => {
  const userId = req.user._id;
  const query = q2m(req.query)
  const { criteria } = query

  const sheetCriteria = {
    userId,
    ...(criteria.month && {month: criteria.month}),
    ...(criteria.year && {year: criteria.year}),
  }
  const rowCriteria = {
    userId,
    ...(criteria.stHr && { 'startTime.hour': criteria.stHr }),
    ...(criteria.stMin && { 'startTime.minute': criteria.stMin }),
    ...(criteria.endHr && { 'endTime.hour': criteria.endHr }),
    ...(criteria.endMin && { 'endTime.minute': criteria.endMin }),
    ...(criteria.date && { date : criteria.date }),
    ...(criteria.dur && { duration: criteria.dur}),
    ...(criteria.amount && { 'rate.amount': criteria.amount }),
    ...(criteria.per && { 'rate.per': criteria.per }),
    ...(criteria.task && { task: criteria.task }),
  };

  console.log(rowCriteria)
  try {
    const sheets = await SheetModel.find(sheetCriteria)
      .sort({
        year: 1,
        month: 1,
      })
      .populate({ path: 'rows', match: rowCriteria });

      
      if (!sheets) {
        return res.status(404).json({
          error: 'no sheets found!',
        });
      }
      
      const filterSheets = sheets.filter((s) => {
        if (!criteria.task) {
          return s
        } else {
          return s.rows.length > 0
        }
      })

    res.json(
      filterSheets,
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Generic server error!',
    });
  }
}

export const getUserSheetById = async(req, res) => {
  const userId = req.user._id
  const _id = req.params.sheetId
  console.log('req.profile: ', req.profile)
  console.log('req.user: ', req.user)

  if(!isValidOId(_id)) {
    return res.status(422).json(
      {error: 'sheetId is invalid'}
    )
  }
  
  try {
    const sheet = await SheetModel.findById(_id);
    if (!sheet) {
      return res.status(404).json({
        error: 'No sheet found!',
      });
    }
    if (!sheet.userId.equals(userId)) {
      return res.status(403).json({
        error: 'Action forbidden!'
      })
    }

    const rows = await RowModel
      .find({ sheetId: sheet._id})
      .sort({
        date: 1
      })
    res.json(
      rows
    )
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Generic server error!',
    });  
  }
}

// export const getAllSheetsAndRows = async (req, res) => {
//   const userId = req.user._id
//   try {
//     const sheet = await SheetModel.find({ userId })
//     const idArr = sheet.map((s) => {
//       return s._id
//     })
//     const rows = await RowModel.find({sheetId: sheet._id})
    
//     res.json(sheet, rows)
//   } catch (error) {
//     console.log(error)
//     res.json(error)
//   }
// }

// export const getThisMonthSheet = async (req,res) => {
//   const userId = req.user._id
//   const getDate = moment().format('MM-YYYY');
//   const month = parseInt(getDate.split('-')[0]);
//   const year = parseInt(getDate.split('-')[1]);

//   try {
//     const sheet = await SheetModel.findOne({userId, month, year})
//     res.json({
//       sheet
//     })
//   } catch (error) {
//     res.status(500).json({
//       error
//     })
//   }
// }

export const deleteUserSheet = async(req, res) => {
  const userId = req.user._id
  const _id = req.params.sheetId
  try {
    const sheet = await SheetModel.findById(_id);
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

    await SheetModel.deleteOne({_id})
    await RowModel.deleteMany({ sheetId: _id })
    res.json({
      message: "Sheet deleted!"
    })
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
}

export const downloadSheet = async (req, res) => {
  const userId = req.user._id
  const { sheetId } = req.params
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

    const sheetName = moment([sheet.year, sheet.month]).format('MMMYY')

    const rows = await RowModel.find({ sheetId: sheet._id }).sort({
      date: 1,
    });

    if (rows.length <= 0) {
      return res.status(422).json({
        error: 'You have nothing registered in this sheet/month'
      })
    }
 
    let workbook = new Excel.Workbook()
    let worksheet = workbook.addWorksheet(sheetName)

    worksheet.columns = [
      {header: 'Date', key: 'date', width: 200},
      {header: 'Start time', key: 'startTime'},
      {header: 'End time', key: 'endTime'},
      {header: 'Pause', key: 'pause'},
      {header: 'Planned Hour', key: 'plannedHrs'},
      {header: 'Planned Minute', key: 'plannedMins'},
      {header: 'Rate', key:'amount'},
      {header: 'per', key:'per'},
      {header: 'overtime', key: 'overtime'},
      {header: 'task', key: 'task'}
    ]

    worksheet.getRow(1).font = {bold: true}

    rows.forEach((data, index) => {
      // const rowIndex = index + 2
      console.log(data)
      worksheet.addRow({
        date: moment(`${sheet.year}-${sheet.month}-${data.date}`).format(
          'ddd, DD.'
        ),
        startTime: data.startTime,
        endTime: data.endTime,
        pause: data.pause,
        plannedHrs: data.plannedTime.hours,
        plannedMins: data.plannedTime.minutes,
        amount: data.rate.amount,
        per: data.rate.per,
        overtime: data.overtime,
        task: data.task,
      });
    })

    // const totalRegisteredDays = worksheet.rowCount

    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'B2' },
    ];

    // res.set({
    //   'Content-Type' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   'Content-Disposition' : 'attachment; filename=' + `${sheetName}.xlsx`
    // })

    
    await workbook.xlsx.writeFile(`${sheetName}.xlsx`);

    return res.json({
      message: `${sheetName}.xlsx is downloaded!`
    })

    
  
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Generic server error'
    })
  }
}