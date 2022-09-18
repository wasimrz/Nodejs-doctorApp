const mongoose = require("mongoose");

const ProblemSchema = mongoose.Schema({
  _id: { type: String },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  problemName: String,
  displayName: String,
  icons: [String],
});

//Adding middlewares
ProblemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// export model user with DoctorSchema
module.exports = mongoose.model("Problems", ProblemSchema, "Problems");
