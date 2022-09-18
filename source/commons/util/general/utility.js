require('dotenv').config();
const countryCodes = require('country-codes-list');
const PhoneUtil = require('google-libphonenumber');
const pnf = require('google-libphonenumber');
const phoneUtil = PhoneUtil.PhoneNumberUtil.getInstance();
const PNF = pnf.PhoneNumberFormat;
const { omit, isNull, isUndefined, isEmpty } = require('lodash');

function GeneralUtil() {}

GeneralUtil.prototype.generateNumericOTP = function () {
  const digits = '0123456789';
  const otpLength = 6; //envproperties.OTP_LEN;
  let otp = '';

  for (let i = 1; i <= otpLength; i++) {
    const index = Math.floor(Math.random() * digits.length);
    otp += digits[index];
  }

  return otp;
};
GeneralUtil.prototype.isValidEmail = function (email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
GeneralUtil.prototype.isValidMobileNumber = function (contact) {
  const re = /^([+]\d{2})?\d{10}$/;
  return re.test(String(contact));
};

GeneralUtil.prototype.isDef = (param) => {
  if (isNull(param) || isUndefined(param)) {
    return false;
  } else {
    return true;
  }
};

GeneralUtil.prototype.callingCodeToAlpha2 = (countryCallingCode) => {
  countryCallingCode = parseInt(countryCallingCode);
  if (!countryCallingCode || isNaN(countryCallingCode)) {
    return;
  }
  let country = countryCodes.findOne(
    'countryCallingCode',
    countryCallingCode.toString()
  );
  return country ? country.countryCode : null;
};
const n = phoneUtil.parseAndKeepRawInput('202-456-1414', 'US');

// countryCode e.g. IN, AE
// Returns e.g. 91, 971 etc.
GeneralUtil.prototype.alpha2ToCallingCode = (countryCode) => {
  // console.log({
  //   countryCode,
  // });
  let country = countryCodes.findOne('countryCode', countryCode);
  return country ? country.countryCallingCode : null;
};

GeneralUtil.prototype.getFormattedMobile = (mobileRaw, regionCode) => {
  try {
    if (!mobileRaw) {
      // throw Boom.notFound("Mobile number is required!");
      let formattedMobileObj = {
        mobileRaw,
        valid: false,
      };
      return formattedMobileObj;
    }
    if (!regionCode) {
      // throw Boom.notFound("Country Region Code is required!");
      let formattedMobileObj = {
        mobileRaw,
        valid: false,
      };
      return formattedMobileObj;
    }

    // if regionCode is 91 then Converting 91 to 'IN'
    if (regionCode && !isNaN(parseInt(regionCode))) {
      regionCode = callingCodeToAlpha2(regionCode);
    }
    let formattedMobileObj = {
      mobileRaw,
      valid: false,
    };

    let mobileNumber = phoneUtil.parseAndKeepRawInput(
      mobileRaw.toString(),
      regionCode
    );
    if (mobileNumber) {
      let isMobileNumberValidForRegion = phoneUtil.isValidNumberForRegion(
        mobileNumber,
        regionCode
      );
      // console.log({
      //   isMobileNumberValidForRegion,
      // });
      if (isMobileNumberValidForRegion) {
        formattedMobileObj.countryCode = mobileNumber.getCountryCode();
        formattedMobileObj.regionCode =
          phoneUtil.getRegionCodeForNumber(mobileNumber);
        formattedMobileObj.mobile = mobileNumber.getNationalNumber();
        formattedMobileObj.pnf = phoneUtil.format(mobileNumber, PNF.E164);
        // console.log({
        //   formattedMobileObj,
        // });

        formattedMobileObj = { ...formattedMobileObj, valid: true };
      }
    }

    return formattedMobileObj;
  } catch (error) {
    console.log('error');
    console.log(error);
  }
};

module.exports = new GeneralUtil();
