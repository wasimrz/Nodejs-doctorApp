require('dotenv');
const OAuth2 = require('../../commons/auth/OAuth2');
const repository = require('./LoginRepository');
const { Context } = require('../../commons/context/dbContext');
const {
  Mailer,
  ResourceAPI
} = require('../../commons/externals/externalsManager');
const { crypto, datetime } = require('../../commons/util/UtilManager');
const { API } = require('../../commons/config/ConfigManager');
const logger = require('../../commons/logger/logger');
const { User, Account } = require('../../commons/models/mongo/mongodb');
const mongoose = require('mongoose');
function Service() {}
const {
  crypto: CryptoUtil,
  utility: GeneralUtil
} = require('../../commons/util/UtilManager');
const envproperties = require('../../properties.json');
const encoder = require('urlencode');
const smsObj = require('../../commons/mailer/mailer.js');
const UserRepository = require('../user/UserRepository');

Service.prototype.generateAccessToken = async function(userId) {
  return OAuth2.getAccessToken(userId);
};

Service.prototype.getUserApplications = async function(
  userId,
  { accessToken, refreshToken, expiresAt, profileImage }
) {
  const { appType } = await Context.get('user_permissions');
  const userObj = await repository.getUserById(userId);

  if (userObj.apps) {
    userObj.apps = userObj.apps.map(x => {
      return {
        appTypeId: x.appTypeId,
        name: appType[x.appTypeId].appType,
        link:
          appType[x.appTypeId].appURL +
          `/login/success?profileImageURL=${profileImage}&userId=${userId}&accessToken=${accessToken}&refreshToken=${refreshToken}&expiresAt=${expiresAt}`
      };
    });
  }

  return userObj;
};

Service.prototype.findUserByContact = async function(contact) {
  const contactENC = crypto.encrypt(contact);
  return repository.getUserByFilterParam({ mobile: contactENC });
};

Service.prototype.findUserByEmail = async function(email) {
  const emailENC = crypto.encrypt(email);
  return repository.getUserByFilterParam({ email: emailENC });
};

Service.prototype.generateLoginOTP = async function() {
  return Math.floor(100000 + Math.random() * 900000);
};

Service.prototype.prepareOTPMessage = async function(user, otp) {
  let data = {
    mobile: user.mobile ? crypto.decrypt(user.mobile) : null,
    email: user.email ? crypto.decrypt(user.email) : null,
    subject: envproperties.OTP_SUB,
    var1: otp,
    var2: process.env.LOCAL_OTP_VALIDITY
  };
  if (user.templateFor == 'ForgetPassword') {
    data.templateName = 'ForgetPassword';
    data.template = envproperties.FORGOT_PASSWORD_TEMPLATE;
    data.body = envproperties.FORGOT_PASSWORD_OTP.replace('<OTP>', otp).replace(
      '{#var#}',
      'e52dwnzI4WX'
    );
  }
  if (user.templateFor == 'Login') {
    data.templateName = 'Login';
    data.template = envproperties.LOGIN_SMS_TEMPLATE;
    data.body = envproperties.LOGIN_OTP.replace('<OTP>', otp).replace(
      '{#var#}',
      'e52dwnzI4WX'
    );
  }
  return data;
};

Service.prototype.sendOTP = async function(msg) {
  let smsFeed, emailFeed;
  if (msg.mobile)
    try {
      msg.to = msg.mobile;
      msg.body = encoder.encode(msg.body);
      smsFeed = await smsObj.sendSMS(msg);
    } catch (e) {
      logger.error(e);
    }
  if (msg.email)
    try {
      emailFeed = await UserRepository.sendOTPThroughEmail(
        msg.email, //email
        msg.var1, //otp
        msg.templateName //to select template
      );
    } catch (e) {
      logger.error(e);
    }

  const sentSMS = smsFeed == undefined ? false : true;
  const sentEMAIL = !!(( await emailFeed || {}).ResponseMetadata || {}).RequestId;
  return { sentSMS, sentEMAIL };
};

Service.prototype.sendOTPEmail = async function(email, otp, name) {
  return await UserRepository.sendOTPThroughEmail(email, otp, name);
};

Service.prototype.saveOTPtoProfile = async function(user, msg) {
  const params = {
    otp: crypto.hash(msg.var1),
    expiry: datetime.addDeltaToMoment(process.env.LOCAL_OTP_VALIDITY)
  };

  return repository.saveOTP2UserProfile(user._id, params);
};

Service.prototype.isTooSoonToRetry = async function(user) {
  if (!user.otpExpiry) return false;

  const diff = datetime.dateDifferenceBetween(
    user.otpExpiry,
    datetime.now(),
    'seconds'
  );
  return diff > 0;
};

Service.prototype.simulateLogin = async function(username, otp, resource) {
  const url = API.gateway.login.simulate;
  const login = (
    (await ResourceAPI.https.patch(url, null, {
      username,
      otp,
      resource
    })) || {}
  ).data;

  return login.data;
};

Service.prototype.updatePassword = async function(userId, password) {
  return repository.updatePasswordByUserId(userId, crypto.hash(password));
};

Service.prototype.updateUser = async function(userId, tokenObj) {
  return repository.updateUser(userId, tokenObj);
};
Service.prototype.findUser = async function(email, mobile) {
  const emailENC = crypto.encrypt(email);
  const mobileENC = crypto.encrypt(mobile);
  return repository.getUserByFilterParam({
    $or: [{ email: emailENC }, { mobile: mobileENC }]
  });
};
Service.prototype.regUser = async function(req) {
  const { contact, password, email } = req;
  let encryptMobile = CryptoUtil.encrypt(contact, true);
  let encryptEmail = CryptoUtil.encrypt(email, true);
  const genOTP = GeneralUtil.generateNumericOTP();
  const otpData = { otp: genOTP };
  otpData.to = contact;
  otpData.body = envproperties.OTP_CONTENT.replace('<OTP>', genOTP);
  otpData.body = encoder.encode(otpData.body);
  smsObj.sendSMS(otpData);
  let encryptPassowrd = CryptoUtil.hash(password);
  let timeout = envproperties.OTP_VALIDITY;
  let pseudoUserId = new mongoose.Types.ObjectId().toHexString();
  let otpEncrypt = CryptoUtil.hash(genOTP);

  const accountId = new mongoose.Types.ObjectId().toHexString();
  const user = new User();
  const account = new Account();
  user._id = account._id = accountId;
  user.mobile = account.mobile = encryptMobile;
  user.email = account.email = encryptEmail;
  user.password = encryptPassowrd;
  user.updatedAt = new Date();
  user.createdAt = new Date();
  user.otpExpiry = new Date();
  user.passwordOtp = otpEncrypt;
  // user.devices= userObj.devices

  // PermissionTemplate Loading
  // user.apps = PermissionTemplate.apps;

  await user.save();
  await account.save();

  return accountId;
};
Service.prototype.updateUserById = async function(userId, value) {
  return repository.updateUserById(userId, value);
};

module.exports = new Service();
