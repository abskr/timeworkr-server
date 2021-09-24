import mongoose from 'mongoose';
import crypto from 'crypto';

const { Schema, model } = mongoose;

// Create Schema
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    templates: [
      new Schema({
        tempName: {type: String, required: true},
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
        duration: {
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
        task: String,
      }),
    ],
    hashPassword: {
      type: String,
      required: true,
    },
    salt: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual('password')
  .set(function (password) {
    // create temporary variable called 'password'
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encrypt password
    this.hashPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashPassword;
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
};

export default model('user', UserSchema);
