const Response = require("../../commons/responses/EcomResponseManager");
const logger = require("../../commons/logger/logger");
const service = require("./policyService");
const { S3 } = require('../../commons/util/UtilManager');

function Controller() { }

Controller.prototype.addPolicy = async function (req, res, next) {
  try { 
    if (!req.files.image) {
    return res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json("Please select a image to upload"));
  } 
    req.body.image = await S3.doUpload(req.files && req.files.image, 'policy');
    let addDetails = await service.addPolicyData(req.body);
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data:addDetails,message:"Policy created successfully ."
      })
    );
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
};


Controller.prototype.getPolicy = async function (req, res, next) {
  try {
    let allData = await service.getAllPolicy();
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: allData,
      })
    );
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
};

module.exports= new Controller()
