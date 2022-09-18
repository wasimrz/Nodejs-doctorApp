const mongoose = require("mongoose");

const InsuranceSchema = mongoose.Schema({
  _id: { type: String },
  
  logo: String,
  name: String,

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Insurance", InsuranceSchema);
