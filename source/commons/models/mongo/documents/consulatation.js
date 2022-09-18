const mongoose = require('mongoose');
const Doctor = require('./doctor');
const User = require('./user');

const ConsultationSchema = mongoose.Schema({
  _id: { type: String },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  dateTime: Date,
  name: String,
  summary: String,
  userId: { type: String, ref: User },
  doctorId: { type: String, ref: Doctor },
  appointmentId: String, //{ type: mongoose.Schema.ObjectId, ref: appointment },
  /*meds: [{
      name:["para","dolo"]
      isLatest:1,
      sNumber:1 //higher the number means it is latest
      }] */
  meds: [
    {
      name: [String],
      sNumber: Number,
      isLatest: Boolean
    }
  ],
  test: [
    {
      details: {
        _id: String,
        testName: String,
        description: String,
        icons: [String],
        displayName: String
      },
      sNumber: Number,
      isLatest: Boolean
    }
  ],
  problem: [
    {
      details: {
        _id: String,
        problemName: String,
        displayName: String,
        icons: [String]
      },
      sNumber: Number,
      isLatest: Boolean
    }
  ]
});
// export model user with ConsultationSchema
module.exports = mongoose.model(
  'Consultation',
  ConsultationSchema,
  'Consultation'
);
