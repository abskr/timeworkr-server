import mongoose from 'mongoose';
import RowModel from './Row.js'

const { Schema, model } = mongoose;

// Create Schema
const SheetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    month: {
      type: Number,
      min: 0,
      max: 11,
      required: true,
    },
    year: {
      type: Number,
      min: 1000,
      max: 9999,
    },
    sumWorkingHours: Number,
    sumIncome: Number
  },
  {
    rows : [{
      type: Schema.Types.ObjectId,
      ref: 'row'
    }]
  },
  {
    timestamps: true,
  }
);

SheetSchema.statics.updateSheetSum = async function (sheetId, userId) {
  try {
  const matchFilter = {
    sheetId: mongoose.Types.ObjectId(sheetId),
    // userId: mongoose.Types.ObjectId(userId),
  };
  const sum = await RowModel.aggregate([
    { $match: matchFilter },
    { $group: { _id: '$sheetId', totalHours: { $sum: '$duration' }, totalIncome: { $sum: '$income' } } },
  ]);
  
  const update = await this.findByIdAndUpdate(
    sheetId,
    {
      sumWorkingHours: sum[0].totalHours,
      sumIncome: sum[0].totalIncome,
    },
    {
      new: true,
      omitUndefined: true,
    }
  );

  return update
  } catch (error) {
    console.log(error)    
  }
};

// SheetSchema.pre('save', function() {
//   console.log(this)
// })
export default model('sheet', SheetSchema);
