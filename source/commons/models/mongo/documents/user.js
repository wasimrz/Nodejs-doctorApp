const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  _id: { type: String },
  social: {
    google: {
      id: String,
      name: String,
      given_name: String,
      family_name: String,
      picture: String,
      email: String,
      email_verified: Boolean,
      locale: String,
    },
    facebook: {
      id: String,
      name: String,
      picture: String,
      email: String,
      email_verified: Boolean,
      locale: String,
    },
    twitter: {
      id: String,
      picture: String,
      email: String,
      email_verified: Boolean,
      locale: String,
      access_token: String,
      refresh_token: String,
    }
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  profile: String,
  email: String,
  mobile: String,
  password: String,
  passwordOtp: String,
  otpExpiry: Date,
  token: Object,
  isAdmin:{
    type:Boolean,
    default:false
  }, 
   appointmentDetails:[{
    _id: String,
    patientName: String,
    patientAge: String,
    scheduleDate: Date,
    docterId:String,
    problem: [
      {
        _id: String,
        problemName: String,
        displayName: String,
        icons: [String],
      },
    ],
    test: [
      {
        _id: String,
        testName: String,
        description: String,
        icons: [String],
        displayName: String,
      },
    ],
    appointmentType:{
      type: String
    }

  }],
  isFirst:{
    type:Boolean,
    default:false
  }
});

// export model user with UserSchema
module.exports = mongoose.model('Users', UserSchema);


