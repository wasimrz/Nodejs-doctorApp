require('dotenv');
const mongoose = require('mongoose');

const encoder = require('urlencode');
const { ResourceAPI } = require('../../commons/externals/externalsManager');
const { API } = require('../../commons/config/ConfigManager');
const {
  Scheduler,
  Context,
} = require('../../commons/context/pseudoUserContext');
const repository = require('./UserRepository');
const { crypto: CryptoUtil } = require('../../commons/util/UtilManager');
const { utility: utils } = require('../../commons/util/UtilManager');
const envproperties = require('../../properties.json');
const smsObj = require('../../commons/mailer/mailer.js');
const OAuth2 = require('../../commons/auth/OAuth2');
const {
  isValidEmail,
  isDef,
  callingCodeToAlpha2,
  formattedMobile,
} = require('../../commons/util/general/utility');
const { trim, isEmpty } = require('lodash');

function Service() {}

Service.prototype.simulateLogin = async function (
  username,
  password,
  resource
) {
  const url = API.gateway.login.simulate;
  const login = (
    (await ResourceAPI.https.patch(url, null, {
      username,
      password,
      resource,
    })) || {}
  ).data;

  return login.data;
};

Service.prototype.removeUserAccount = async function (_id) {
  return repository.deleteUserAccount(_id);
};

Service.prototype.removeUser = async function (_id) {
  return repository.deleteAccount(_id);
};
Service.prototype.regPseudoUser = async function (req) {
  const { contact, name, firstName, lastName, password, email } = req.body;
  let user = null;
  let encryptMobile = CryptoUtil.encrypt(contact, true);
  let encryptEmail = CryptoUtil.encrypt(email, true);

  user = await repository.findUserByMobile(encryptMobile);
  user =
    user || (email ? await repository.findUserByEmail(encryptEmail) : null);

  if (user == null) {
    const genOTP = utils.generateNumericOTP();
    console.log('454545454545454545', genOTP);
    const otpData = { otp: genOTP };

    otpData.to = contact;
    otpData.body = envproperties.SIGNUP_OTP.replace('<OTP>', genOTP).replace(
      '{#var#}',
      'e52dwnzI4WX'
    );
    otpData.body = encoder.encode(otpData.body);
    otpData.template = envproperties.SIGNUP_SMS_TEMPLATE;
    smsObj.sendSMS(otpData);

    await repository.sendOTPThroughEmail(email, genOTP, 'Register');

    let encryptFirstName = CryptoUtil.encrypt(firstName || name);
    let encryptLastName = CryptoUtil.encrypt(lastName);
    let encryptFullName = CryptoUtil.encrypt(
      name || `${firstName} ${lastName}`
    );
    let encryptPassowrd = CryptoUtil.hash(password);
    let timeout = envproperties.OTP_VALIDITY;
    let pseudoUserId = new mongoose.Types.ObjectId().toHexString();

    Scheduler.schedule({
      timeout,
      key: pseudoUserId,
      value: {
        mobile: encryptMobile,
        name: encryptFullName,
        firstName: encryptFirstName,
        lastName: encryptLastName,
        password: encryptPassowrd,
        otp: genOTP,
        email: encryptEmail,
      },
    });
    console.log('748787878787', pseudoUserId);
    return pseudoUserId;
  }

  return false;
};

Service.prototype.regPseudoUserV2 = async function (req) {
  const {
    phone,
    name,
    firstName,
    lastName,
    password,
    confirmPassword,
    email,
    countryCode,
    country,
    state,
    city,
  } = req.body;
  let user = null;

  await service.checkUserValidation(req);

  let encryptMobile = CryptoUtil.encrypt(phone, true);
  let encryptEmail = CryptoUtil.encrypt(email, true);

  user = await repository.findUserByMobile(encryptMobile);
  user =
    user || (email ? await repository.findUserByEmail(encryptEmail) : null);

  if (user == null) {
    const genOTP = utils.generateNumericOTP();
    console.log('454545454545454545', genOTP);
    const otpData = { otp: genOTP };

    otpData.to = contact;
    otpData.body = envproperties.SIGNUP_OTP.replace('<OTP>', genOTP).replace(
      '{#var#}',
      'e52dwnzI4WX'
    );
    otpData.body = encoder.encode(otpData.body);
    otpData.template = envproperties.SIGNUP_SMS_TEMPLATE;
    smsObj.sendSMS(otpData);

    await repository.sendOTPThroughEmail(email, genOTP, 'Register');

    let encryptFirstName = CryptoUtil.encrypt(firstName || name);
    let encryptLastName = CryptoUtil.encrypt(lastName);
    let encryptFullName = CryptoUtil.encrypt(
      name || `${firstName} ${lastName}`
    );
    let encryptPassowrd = CryptoUtil.hash(password);
    let timeout = envproperties.OTP_VALIDITY;
    let pseudoUserId = new mongoose.Types.ObjectId().toHexString();

    Scheduler.schedule({
      timeout,
      key: pseudoUserId,
      value: {
        mobile: encryptMobile,
        name: encryptFullName,
        firstName: encryptFirstName,
        lastName: encryptLastName,
        password: encryptPassowrd,
        otp: genOTP,
        country: country,
        state: state,
        city: city,
        email: encryptEmail,
      },
    });
    console.log('748787878787', pseudoUserId);
    return pseudoUserId;
  }

  return false;
};

Service.prototype.checkUserValidation = async function (req) {
  const {
    phone,
    name,
    firstName,
    lastName,
    password,
    confirmPassword,
    email,
    countryCode,
    country,
    state,
    city,
  } = req.body;
  let user = null;
  if (!isDef(phone)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('Phone is required.'));
  }

  if (!isDef(countryCode)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('Country code is required.'));
  }

  if (!isDef(name) || isEmpty(name)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('Name is required.'));
  }
  if (!isDef(firstName) || isEmpty(firstName)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('Name is required.'));
  }

  if (!isDef(lastName) || isEmpty(lastName)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('Last name is required.'));
  }
  if (!isDef(password) || isEmpty(password)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('Password is required.'));
  }

  if (!isDef(confirmPassword) || isEmpty(confirmPassword)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(
        Response.error.InvalidRequest.json('Confirm password is required.')
      );
  }

  if (!isDef(email) || !isValidEmail(email)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('Valid email required.'));
  }
  if (!isDef(country) || isEmpty(country)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('Country is required.'));
  }

  if (!isDef(state) || isEmpty(state)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('State is required.'));
  }

  if (!isDef(city) || isEmpty(city)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('City is required.'));
  }

  let regionCode = callingCodeToAlpha2(countryCode);

  if (!isDef(regionCode)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('Country code wrong.'));
  }
  let formattedMobile = getFormattedMobile(phone, regionCode);

  if (!isDef(formattedMobile) || !formattedMobile.valid) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(
        Response.error.InvalidRequest.json(
          'Mobile and country code does not match.'
        )
      );
  }

  if (isDef(email) && !isValidEmail(email)) {
    return res
      .status(Response.error.InvalidRequest.code)
      .json(Response.error.InvalidRequest.json('Invalid email.'));
  }

  if (isDef(email) && isValidEmail(email)) {
    let isEmailAlreadyPresent = await service.getDoctorByEmail(
      email,
      isDoctorExist?._id
    );

    if (isDef(isEmailAlreadyPresent)) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(Response.error.InvalidRequest.json('Email already exists.'));
    }
  }
};

Service.prototype.validateAndReg = async function (req) {
  const { pseudoUserId, otp, deviceId } = req.body;
  const pseudoUserData = await Context.get(pseudoUserId);

  if (pseudoUserData && pseudoUserData.otp == otp) {
    let userObj = {};
    userObj.firstName = pseudoUserData.firstName;
    userObj.lastName = pseudoUserData.lastName;
    userObj.name = pseudoUserData.name;
    userObj.mobile = pseudoUserData.mobile;
    userObj.email = pseudoUserData.email;
    userObj.password = pseudoUserData.password;
    userObj.devices = [{ deviceId: deviceId, deviceActive: true }];

    const user = await repository.createUserWithMobile(userObj);

    Context.del(pseudoUserId);

    if (user != null) {
      let data = {};
      data.userId = user;

      const accessToken = await OAuth2.getAccessToken(user);
      data.accessToken = accessToken.access_token;
      data.refreshToken = accessToken.refresh_token;
      data.expiresAt = accessToken.expires_at;

      return data;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

Service.prototype.updateProfile = async function (data) {
  return repository.updateProfile(data);
};

module.exports = new Service();
