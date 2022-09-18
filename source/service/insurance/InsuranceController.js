require('dotenv').config();
const logger        = require('../../commons/logger/logger');
const Response      = require('../../commons/responses/EcomResponseManager');
const service       = require('./InsuranceService');

function Controller () {}

Controller.prototype.add = async function (req, res, next) {
  try {
  
    let { _id, name, email, age, mobile, country,
    state, city,gender,address, amount,date } = req.body;
  
    let isInsuranceAdded = await service.addDetails(
      { _id, name, email, age, mobile, country,
        state, city,gender,address, amount,date },
      "Insurancesubmission"
    );

    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: {
          name: isInsuranceAdded.name,
          email: isInsuranceAdded.email,
          age: isInsuranceAdded.age,
          mobile: isInsuranceAdded.mobile,
          country: isInsuranceAdded.country,
          state: isInsuranceAdded.state,
          city: isInsuranceAdded.city,
          gender: isInsuranceAdded.gender,
          address: isInsuranceAdded.address,
          amount: isInsuranceAdded.amount,
          date: isInsuranceAdded.date,
        },
      })
    );
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
};

Controller.prototype.createInsurance = async function(req, res, next) {
  try {
    const data = await service.addInsurance(req);
    if (data) {
      res.status(Response.success.Ok.code).json(Response.success.Ok.json({
        message: 'Insurance added successfully',
        data: data,
      }));
    } else {
      res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json(
        'Failed to create the Insurance'
      ));
    };
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
}

Controller.prototype.getAllInsurances = async function (req, res, next) {
  try {
    const data = await service.getAllInsurance();
    if (data) {
      res.status(Response.success.Ok.code).json(Response.success.Ok.json({
        message: 'All Insurances',
        data: data,
      }));
    } else {
      res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json(
        'Failed to fetch the Insurance'
      ));
    };
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
}

module.exports = new Controller();
