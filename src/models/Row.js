import moment from 'moment';
import mongoose from 'mongoose';
import SheetModel from './Sheet.js';

const { Schema, model } = mongoose;

// Create Schema
export const RowSchema = new Schema(
  {
    sheetId: {
      type: Schema.Types.ObjectId,
      ref: 'sheet',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    startTime: {
      hour: {
        type: Number,
        min: 0,
        max: 23,
        reruired: true,
      },
      minute: {
        type: Number,
        min: 0,
        max: 59,
        reruired: true,
      },
    },
    endTime: {
      hour: {
        type: Number,
        min: 0,
        max: 23,
        reruired: true,
      },
      minute: {
        type: Number,
        min: 0,
        max: 59,
        reruired: true,
      },
    },
    pause: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: Number,
      default: function () {
        // console.log(this);
        let start = moment.utc(
          `${this.startTime.hour}:${this.startTime.munte}`,
          'HH:mm'
        );
        let end = moment.utc(
          `${this.endTime.hour}:${this.endTime.munte}`,
          'HH:mm'
        );

        if (end.isBefore(start)) end.add(1, 'day');

        let dur = moment.duration(end.diff(start));

        const durationAsHour = dur.subtract(this.pause, 'minutes').asHours();

        return durationAsHour;
      },
    },
    plannedTime: {
      hours: {
        type: Number,
        default: 0,
        min: 0,
      },
      minutes: {
        type: Number,
        default: 0,
        min: 0,
        max: 59,
      },
    },
    overtime: {
      type: Number,
      default: function () {
        if (!this.plannedTime.hours && !this.plannedTime.minutes) {
          return null;
        }

        const plannedTimeAsHours = moment
          .duration({
            hours: this.plannedTime.hours,
            minutes: this.plannedTime.minutes,
          })
          .asHours();

        const hours = this.duration - plannedTimeAsHours;

        return hours;
      },
    },
    rate: {
      per: {
        type: String,
        enum: ['hour', 'day', ''],
      },
      amount: {
        type: Number,
        min: 0,
      },
    },
    income: {
      type: Number,
      default: function () {
        if (this.rate.per === 'hour') {
          return this.duration * this.rate.amount;
        } else if (this.rate.per === 'day') {
          return this.rate.amount;
        } else {
          return null;
        }
      },
    },
    task: String,
  },
  {
    timestamps: true,
  }
);

RowSchema.post('findOneAndDelete', async function (row) {
  await SheetModel.findOneAndUpdate({_id: row.sheetId, userId: row.userId}, {
    $pull: { rows: row._id }
  })
  await SheetModel.updateSheetSum(row.sheetId, row.userId);
})

RowSchema.post('findOneAndUpdate', async function (row) {
  await SheetModel.updateSheetSum(row.sheetId,row.userId)
})

RowSchema.pre('findOneAndUpdate', async function (next) {
  const row = this._update;

  const newDuration = function () {
    let start = moment.utc(
      `${row.startTime.hour}:${row.startTime.minute}`,
      'HH:mm'
    );
    let end = moment.utc(
      `${row.endTime.hour}:${row.endTime.minute}`,
      'HH:mm'
    );

    if (end.isBefore(start)) end.add(1, 'day');

    let dur = moment.duration(end.diff(start));

    const durationAsHour = dur.subtract(row.pause, 'minutes').asHours();

    return durationAsHour;
  };

  const newOvertime = function () {
    if (!row.plannedTime.hours && !row.plannedTime.minutes) {
      return null;
    }

    const plannedTimeAsHours = moment
      .duration({
        hours: row.plannedTime.hours,
        minutes: row.plannedTime.minutes,
      })
      .asHours();

    const hours = newDuration() - plannedTimeAsHours;

    return hours;
  };

  const newIncome = function () {
    if (row.rate.per === 'hour') {
      return Number(newDuration() * row.rate.amount);
    } else if(row.rate.per === 'day') {
      return Number(row.rate.amount)
    }
  };

  this._update.duration = newDuration();
  this._update.overtime = newOvertime();
  this._update.income = newIncome();

  next();
});

RowSchema.post('save', async function (doc) {
  try {
    await SheetModel.findByIdAndUpdate(
      doc.sheetId,
      { $addToSet: { rows: mongoose.Types.ObjectId(doc._id) } },
      { new: true, upsert: true }
    );

    await SheetModel.updateSheetSum(doc.sheetId, doc.userId)
  } catch (error) {
    console.log(error)
  }
})

export default model('row', RowSchema);
