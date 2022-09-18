const mongoose = require("mongoose");

const TestSchema = mongoose.Schema({
  _id: { type: String },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  testName: String,
  description: String,
  icons: [String],
  displayName: String,
});

//Adding middlewares
TestSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// export model user with DoctorSchema
module.exports = mongoose.model("Tests", TestSchema, "Tests");
