const logger = require('../../commons/logger/logger');
const Response = require('../../commons/responses/EcomResponseManager');
const { Context: DBContext } = require('../../commons/context/dbContext');
const { ds, url, utility } = require('../../commons/util/UtilManager');
const encoder = require('urlencode');
const { crypto } = require('../../commons/util/UtilManager');
const service = require('./AdminService');
const LoginService = require('../login/LoginService');
const envproperties = require('../../properties.json');
const {
  sendSMS,
  sendMail2,
  sendAWSEmail
} = require('../../commons/mailer/mailer');
const { send } = require('../../commons/externals/mailer/sms/sendSMS');

function Controller() {}

Controller.prototype.createAdmin = async (req, res, next) => {
  try {
    const user = await LoginService.findUser(req.body.email, req.body.contact);
    if (user) {
      if (crypto.decrypt(user.email) == req.body.email) {
        return res
          .status(Response.error.AlreadyExist.code)
          .json(Response.error.AlreadyExist.json('This email already exists'));
      } else {
        return res
          .status(Response.error.AlreadyExist.code)
          .json(
            Response.error.AlreadyExist.json(
              'This mobile number already exists'
            )
          );
      }
    }
    let saved = await service.adminCreate(req.body);
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: { userId: saved },
        message: 'Admin created successfully .'
      })
    );
  } catch (error) {
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.getAppLink = async function(req, res, next) {
  try {
    const params = { ...req.body, ...req.query, ...req.params };
    const { email, mobileNumber } = req.body;
    if (
      utility.isValidEmail(email) == false &&
      (email === undefined) == false
    ) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(Response.error.Forbidden.json('Please enter a valid email ...'));
    }

    if (
      utility.isValidMobileNumber(mobileNumber) == false &&
      (mobileNumber === undefined) == false
    ) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.Forbidden.json(
            'Please enter a valid mobile number ...'
          )
        );
    }
    let obj, obj2, obj3, data, mdata;
    if (mobileNumber && email) {
      obj = {
        to: email,
        subject: 'Here comes the Doctor-Dentist App link for you',
        body: 'Hi doctor dentist'
      };
      obj2 = {
        to: mobileNumber,
        body: encoder.encode(envproperties.DOWNLOAD_ANDROID),
        template: '1007165533637655423'
      };
      obj3 = {
        to: mobileNumber,
        body: encoder.encode(envproperties.DOWNLOAD_IOS),
        template: '1007165533623754098'
      };
      //  data = await sendAWSEmail(obj);
      //send otp through mail
      data = await service.sendEmail(email, 'AppLink');

      mdata = await send(obj2);
      mdata = await send(obj3);
      return res.status(Response.success.Ok.code).json(
        Response.success.Ok.json({
          message:
            'App link has been send on your email and mobile number successfully',
          data: { data, mdata }
        })
      );
    }

    if (mobileNumber) {
      obj2 = {
        to: mobileNumber,
        body: encoder.encode(envproperties.DOWNLOAD_ANDROID),
        template: '1007165533637655423'
      };
      obj3 = {
        to: mobileNumber,
        body: encoder.encode(envproperties.DOWNLOAD_IOS),
        template: '1007165533623754098'
      };
      data = await send(obj2);
      data = await send(obj3);
      console.log('==========>>>>>>', data);
      return res.status(Response.success.Ok.code).json(
        Response.success.Ok.json({
          message: 'App link has been send on your mobile number successfully',
          data: data
        })
      );
    }
    if (email) {
      obj = {
        to: params.email,
        subject: 'Here is the app link',
        body: 'Hi doctor dentist'
      };
      data = await sendAWSEmail(obj);
      return res.status(Response.success.Ok.code).json(
        Response.success.Ok.json({
          message: 'App link has been send on your email successfully',
          data: data
        })
      );
    }
  } catch (error) {
    logger.error(error.message);
    console.log(error);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.login = async function ( req,res) {
  try {
    let data = await service.loginAdmin(req);
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: data,
      })
    );
  }catch(e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());

  }
}

Controller.prototype.sendInvitation = async function(req, res, next) {
  try {
    /*
    1. validate email and phone
    2. Create an onboarding code,onboard code is 6 Character Alpha numeric 
    3. send email and sms
    4. add details to the database for future reference.
    */

    let { email, mobileNumber } = req.body;

    //1. validate email and phone
    if (!email || !mobileNumber) {
      res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.InvalidRequest.json(
            'email and mobileNumber are mandatory fields.'
          )
        );
    }

    if (
      utility.isValidEmail(email) == false &&
      (email === undefined) == false
    ) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(Response.error.Forbidden.json('Please enter a valid email ...'));
    }

    if (
      utility.isValidMobileNumber(mobileNumber) == false &&
      (mobileNumber === undefined) == false
    ) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.Forbidden.json(
            'Please enter a valid mobile number ...'
          )
        );
    }

    //2. Create an onboarding code,onboard code is 6 Character Alpha numeric
    let onBoardingCode = service.getOnboardingCode();
    let msg = await service.prepareOTPMessage(
      { mobile: mobileNumber, email },
      onBoardingCode
    );

    //3. send email and sms
    await service.sendOTP(msg);

    //4. add details to the database for future reference.
    let data = {
      onBoardingCode,
      email,
      phone: mobileNumber
    };
    service.addCode(data);

    res
      .status(200)
      .json({ status: true, messsage: 'Invitation code sent successfully.' });
  } catch (error) {
    logger.error(error.message);
    console.log(error);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.listInvitation = async function(req, res, next) {
  try {
    let data = await service.getInvitations();
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: data
      })
    );
  } catch (error) {
    logger.error(error.message);
    console.log(error);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

module.exports = new Controller();
