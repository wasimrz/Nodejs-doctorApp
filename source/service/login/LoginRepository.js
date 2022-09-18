const {
  User
} = require('../../commons/models/mongo/mongodb');

function Repository() {}

Repository.prototype.getUserById = async function (userId) {
  const instance = await User.findOne({ _id: userId }, { apps: 1 }).exec();
  return instance ? instance.toJSON() : null;
}

Repository.prototype.getUserByFilterParam = async function (param) {
  const instance = await User.findOne(param, { id: 1, mobile: 1, email: 1, otpExpiry: 1,password:1, isAdmin:1 }).exec();
  return instance ? instance.toJSON() : null;
}

Repository.prototype.saveOTP2UserProfile = async function(userId, params) {
  await User.updateOne({ _id: userId }, { $set: { passwordOtp: params.otp, otpExpiry: params.expiry } });
}

Repository.prototype.updatePasswordByUserId = async function(_id, password) {
  return User.updateOne({ _id }, { $set: { password } });
}

Repository.prototype.updateUser = async function(userId, tokenObj) {
  return User.updateOne({
    _id: userId
  }, {
    token: tokenObj
  });
  
}

Repository.prototype.updateUserById = async function(userId, value) {
  return User.findByIdAndUpdate({
    _id: userId
  }, {
    isFirst: value
  });
  
}


module.exports = new Repository();