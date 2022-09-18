require('dotenv').config();
const logger = require('../../commons/logger/logger');
const Response = require('../../commons/responses/EcomResponseManager');
const service = require('./CareerService');
const { profileImage }  = require('../../commons/util/fileUpload/upload'); 


function Controller() {}

Controller.prototype.requestOtp = async function (req, res) {
  try {
    const pseudoUserId = await service.generateOtp(req);
    // console.log()
    if (!pseudoUserId) {
      res
        .status(Response.error.InvalidRequest.code)
        .json(Response.error.InvalidRequest.json('User already exists'));
    } else {
      res.status(Response.success.Ok.code).json(
        Response.success.Ok.json({
          data : {
            pseudoUserId: pseudoUserId,
            message: 'OTP generated for verification ',
          }
        })
      );
    }
  } catch (e) {
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.validateAndLoginApplicant = async function (req, res) {
  try {
    const data = await service.validateOtp(req);
    if (data) {
      res.status(Response.success.Ok.code).json(
        Response.success.Ok.json({
          message: 'Validation successful, Applicant is logged in successfully',
          data: data,
        })
      );
    } else {
      res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.InvalidRequest.json(
            'Validation failed due to otp expiry or invalid otp'
          )
        );
    }
  } catch (e) {
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.submitApplication = async function (req, res) {
  try {
    let data = await service.submitApplication(req);
    if (!data) {
      res
        .status(Response.error.InvalidRequest.code)
        .json(Response.error.InvalidRequest.json('Could not update the application'));
    } else {
      service.sendThankYouSMS(data)
      await service.sendThankyouEmail(data, 'ThankYou');
      res.status(Response.success.Ok.code).json(
        Response.success.Ok.json({
          data: data,
          message: 'Application ',
        })
      );
    }

  } catch (e) {
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

module.exports = new Controller();
