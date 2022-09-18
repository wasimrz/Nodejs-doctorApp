const mongoose = require('mongoose');

const SurgerySchema = mongoose.Schema({
  _id: { type: String },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  surgeryName : String,
  surgeryDescription : String,
  icon : String,
  price : {
    range : {
        startRange : Number,
        endRange : Number
    },
    fixed : Number
  }
});

//Adding middlewares
SurgerySchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

SurgerySchema.index({surgeryName:"text", surgeryDescription:"text"});  
  // export model user with DoctorSchema
module.exports = mongoose.model("Surgery", SurgerySchema, "Surgery");