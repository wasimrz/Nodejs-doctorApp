const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
  _id: { type: String },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  salutation: String,
  firstName: String,
  lastName: String,
  fullName: String,
  email: String,
  mobile: String,
  nationality: String,
  dob: String,
  country: String,
  city: String,
  loyalityFlag: String,
  gender: String,
  address: [{
    address1: String,
    address2: String,
    city: String,
    state: String,
    pincode: String,
    addressType: String,
    defaultAddress: String,
  }],
  SavedCards: [{
    _id: false,
    cardNo: String,
    expiryMonth: Number,
    expiryYear: Number,
    cardHolderName: String,
    bankCode: String,
    bankName: String,
    cardType: String,
    cardCategory: String,
    cardCategoryImg: String,
    remarks: String,
    active: String,
  }],
  occupation: Array,
  incomeBand: String,
  acceptedTnC: Boolean
});

// export model user with AccountSchema
module.exports = mongoose.model('Accounts', AccountSchema, 'Accounts');
