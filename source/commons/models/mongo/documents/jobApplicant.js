const mongoose = require('mongoose');

const JobApplicantSchema = mongoose.Schema({
  _id: { type: String },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  hrCode: {
    type: String,
    required: true,
  },
  passwordOtp: String,
  otpExpiry: Date,
  currentPosition : String,
  totalExperience : String,
  skills : String,
  currentCTC : Number,
  degree : String,
  institution : String,
  resume : String
});

// export model user with UserSchema
module.exports = mongoose.model('JobApplicant', JobApplicantSchema);