const mongoose = require('mongoose');

const InvitationSchema = mongoose.Schema({
  _id: { type: String },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: Date,
  onBoardingCode: String,
  email: String,
  phone: String,
  isVerified: { type: Boolean, default: 0 },
  otp: { type: String, default: '' }
});

// export model user with InvitationSchema
module.exports = mongoose.model('Invitations', InvitationSchema, 'Invitations');
