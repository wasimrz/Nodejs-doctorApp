const { User, Account } = require('../../commons/models/mongo/mongodb');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const smsObj = require('../../commons/mailer/mailer.js');
const ejs = require('ejs');
const mailer = require('../../commons/externals/mailer/mailer');

function Repository() { }

Repository.prototype.deleteAccount = async function (_id) {
  await User.remove({ _id });
  await Account.remove({ _id });
  return true;
};

Repository.prototype.deleteUserAccount = async function (_id) {
  await User.remove({ _id });
  await Account.remove({ _id });
  return true;
};

Repository.prototype.findUserByMobile = async function (mobile) {
  return User.findOne({ mobile: mobile }).exec();
};

Repository.prototype.findUserByEmail = async function (email) {
  return User.findOne({ email }).exec();
};
Repository.prototype.createUserWithMobile = async function (userObj) {
  const user = new User();
  const account = new Account();

  const accountId = new mongoose.Types.ObjectId().toHexString();

  user._id = account._id = accountId;
  user.mobile = account.mobile = userObj.mobile;
  user.email = account.email = userObj.email;
  account.firstName = userObj.firstName;
  account.lastName = userObj.lastName;
  account.fullName = userObj.name;
  user.password = userObj.password;
  user.updatedAt = new Date();
  user.devices = userObj.devices;

  // PermissionTemplate Loading
  // user.apps = PermissionTemplate.apps;

  await user.save();
  await account.save();

  return accountId;
};
Repository.prototype.sendOTPThroughEmail = async function (email, otp, name) {
  /*********** SENDING OTP TO THE USER'S EMAIL *********/
  let file = ``,
    subject = ``;

  //Register template
  if (name == 'Register') {
    file = path.join(
      __dirname,
      '../../views/templates/registerEmailTemplate.html'
    );
    subject = 'Here comes your Signup (New User) OTP';
  }

  //Login template
  if (name == 'Login') {
    file = path.join(
      __dirname,
      '../../views/templates/loginEmailTemplate.html'
    );
    subject = 'Here comes your Login OTP';
  }

  //ForgetPassword template
  if (name == 'ForgetPassword') {
    file = path.join(
      __dirname,
      '../../views/templates/forgetpasswordEmailTemplate.html'
    );
    subject = 'Here comes your Login OTP';
  }

  //App link template
  if (name == 'AppLink') {
    file = path.join(
      __dirname,
      '../../views/templates/applinkEmailTemplate.html'
    );
    subject = 'Here comes the Doctor-Dentist App link for you';
  }

  //invitation template
  if (name == 'Invitation') {
    file = path.join(
      __dirname,
      '../../views/templates/invitationEmailTemplate.html'
    );
    subject = 'Here comes the Doctor-Dentist onboarding code';
  }

  //inivtation otp template
  if (name == 'InvitationOtp') {
    file = path.join(
      __dirname,
      '../../views/templates/invitationOtpEmailTemplate.html'
    );
    subject = 'Here comes the Doctor-Dentist validation Otp';
  }

  await fs.readFile(file, 'utf8', async function(error, data) {
    data = ejs.render(data, { USEROTP: otp });

      // smsObj.sendTransactionalEmail(data);
    smsObj.sendTransactionalEmail({
      to: email,
      subject: subject,
      template: data
    });
    if (error) {
      throw error;
    }
  });
};


Repository.prototype.updateProfile = async function (data) {
  const isUpdated = await User.updateOne(
    { _id: data.userId },
    { ...data }
  );
  return isUpdated.ok ? true : false;
};

module.exports = new Repository();
