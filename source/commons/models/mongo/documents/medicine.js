const mongoose = require('mongoose');
const Doctor = require('./doctor');

const medicineSchema = mongoose.Schema({
  _id: { type: String },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: Date,
  name: String,
  icon: String,
  price: Number,
  doctorId: { type: String, ref: Doctor }
});

//Adding middlewares
medicineSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// export model user with DoctorSchema
module.exports = mongoose.model('Medicines', medicineSchema, 'Medicines');
