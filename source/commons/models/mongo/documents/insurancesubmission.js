const mongoose = require("mongoose");
const { crypto, datetime } = require("./../../../util/UtilManager");

const InsurancesubmissionSchema = mongoose.Schema({
  _id: { type: String },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  firstName: String,
  lastName: String,
  email: String,
  age: Number,
  mobile: String,
  country: String,
  state: String,
  city: String,
  gender: String,
   address: String,
   amount: String,
   date: String
});

module.exports = mongoose.model("Insurancesubmission", InsurancesubmissionSchema, "InsurancesubmissionSchema");
