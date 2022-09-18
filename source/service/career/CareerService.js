const repository = require('./CareerRepository');
const mongoose = require('mongoose');
const { utility: utils } = require('../../commons/util/UtilManager');
const smsObj = require('../../commons/mailer/mailer.js');
const envproperties = require('../../properties.json');
const { crypto: CryptoUtil } = require('../../commons/util/UtilManager');
const encoder = require('urlencode');
const {
  Scheduler,
  Context,
} = require('../../commons/context/pseudoUserContext');
const OAuth2 = require('../../commons/auth/OAuth2');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

function Service() {}

Service.prototype.generateOtp = async function (req) {
  let { name, email, mobile, hrCode } = req.body;

  const genOTP = utils.generateNumericOTP();
  console.log('454545454545454545', genOTP);
  const otpData = { otp: genOTP };

  otpData.to = mobile;
  otpData.body = envproperties.LOGIN_OTP.replace('<OTP>', genOTP).replace(
    '{#var#}',
    'e52dwnzI4WX'
  );
  otpData.body = encoder.encode(otpData.body);
  otpData.template = envproperties.LOGIN_SMS_TEMPLATE;

  smsObj.sendSMS(otpData);

  await repository.sendOTPThroughEmail(email, genOTP, 'Login');

  let encryptName = CryptoUtil.encrypt(name);
  let encryptMobile = CryptoUtil.encrypt(mobile, true);
  let encryptEmail = CryptoUtil.encrypt(email, true);
  let timeout = envproperties.OTP_VALIDITY;
  let pseudoUserId = new mongoose.Types.ObjectId().toHexString();

  Scheduler.schedule({
    timeout,
    key: pseudoUserId,
    value: {
      mobile: encryptMobile,
      name: encryptName,
      hrCode: hrCode,
      otp: genOTP,
      email: encryptEmail,
    },
  });
  console.log('PseudoUserId', pseudoUserId);
  return pseudoUserId;
};

Service.prototype.validateOtp = async function (req) {
  const { pseudoUserId, otp } = req.body;
  const pseudoUserData = await Context.get(pseudoUserId);

  if (pseudoUserData && pseudoUserData.otp == otp) {
    let isUserEmailExists = await repository.getByFilter({
      email: pseudoUserData.email,
    });
    let isUserMobileExists = await repository.getByFilter({
      mobile: pseudoUserData.mobile,
    });
    let applicant;

    if (!isUserEmailExists && !isUserMobileExists) {
      let applicantObj = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: pseudoUserData.name,
        email: pseudoUserData.email,
        mobile: pseudoUserData.mobile,
        hrCode: pseudoUserData.hrCode,
      };
      applicant = await repository.createDocument(applicantObj);
    } else {
      applicant = isUserEmailExists
        ? isUserEmailExists[0]
        : isUserMobileExists[0];
    }

    Context.del(pseudoUserId);

    if (applicant != null) {
      let data = {};
      data.userId = applicant._id;

      const accessToken = await OAuth2.getAccessToken(applicant._id);
      data.accessToken = accessToken.access_token;
      data.refreshToken = accessToken.refresh_token;
      data.expiresAt = accessToken.expires_at;

      return data;
    } else {
      return false;
    }
  }
};

Service.prototype.submitApplication = async function (req) {
  let resume;
  if (req.file != null) {
    resume = req.file.location;
  }
  let applicantId = req.params.userId;
  let {
    currentPosition,
    totalExperience,
    skills,
    currentCTC,
    degree,
    institution,
  } = req.body;
  if (
    currentPosition != null &&
    totalExperience != null &&
    skills != null &&
    currentCTC != null &&
    degree != null &&
    institution != null &&
    resume != null
  ) {
    let applicationObj = {
      currentPosition: currentPosition,
      totalExperience: totalExperience,
      skills: skills,
      currentCTC: currentCTC,
      degree: degree,
      institution: institution,
      resume: resume,
    };

    let query = {_id : applicantId}
    let updation = { $set : applicationObj}

    return repository.getByIDAndUpdate(query,updation);
  } else {
    return false;
  }
};

Service.prototype.sendThankYouSMS = async function (req) {
  let mobile = CryptoUtil.decrypt(req.mobile);
  console.log(mobile);
  const data = { };
  data.to = mobile;
  data.body = envproperties.THANK_YOU_TEMPLATE;
  data.body = encoder.encode(data.body);
  data.template = envproperties.THANK_YOU_TEMPLATE;

  smsObj.sendSMS(data);

}

Service.prototype.sendThankyouEmail = async function(data, name) {

  let email = CryptoUtil.decrypt(data.email);

  /*********** SENDING OTP TO THE USER'S EMAIL *********/
  let file = ``,
    subject = ``;

  //Register template
  if (name == 'ThankYou') {
    file = path.join(
      __dirname,
      '../../views/templates/thankYouForApplyingEmailTemplate.html'
    );
    subject = 'Received Your Application';
  }


  await fs.readFile(file, 'utf8', async function(error, data) {
    data = ejs.render(data);

    smsObj.sendMail2({
      to: email,
      body: subject,
      template: data
    });
    if (error) {
      throw error;
    }
  });
};

module.exports = new Service();
