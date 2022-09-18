const mongoose = require('mongoose');
const { crypto } = require('../../../util/UtilManager');
const Doctor = require('./doctor');
const User = require('./user');

const appointmentSchema = mongoose.Schema({
  _id: { type: String },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: Date,
  patientName: String,
  patientAge: String,
  scheduleDate: {
    availabilityId: String,
    day: String,
    date: Date,
    time: String,
    slotId: String
  },
  problem: [
    {
      _id: String,
      problemName: String,
      displayName: String,
      icons: [String]
    }
  ],
  test: [
    {
      _id: String,
      testName: String,
      description: String,
      icons: [String],
      displayName: String
    }
  ],
  docterId: { type: String, ref: Doctor },
  userId: { type: String, ref: User },
  status: {
    type: String,
    enum: ['ACTIVE', 'DELETED', 'BLOCKED'],
    default: 'ACTIVE'
  },
  appointmentType: {
    type: String,
    enum: ['VIDEO_CALL', 'VOICE_CALL', 'VISIT_CLINIC']
  },
  isCancelled: { type: Boolean, default: 0 },
  isCompleted: { type: Boolean, default: 0 },
  isUpcoming: { type: Boolean, default: 1 }
});
appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// export model user with AppointmentSchema
module.exports = mongoose.model(
  'appointments',
  appointmentSchema,
  'appointments'
);
