const Response = require("../../commons/responses/EcomResponseManager");
const logger = require("../../commons/logger/logger");
const service = require("./termsService");


function Controller() { }

Controller.prototype.addTerms = async function (req, res, next) {
  try { 
    let addDetails = await service.addTermsData(req.body);
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data:addDetails,message:"Terms created successfully ."
      })
    );
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
};


Controller.prototype.getTerms = async function (req, res, next) {
  try {
    let allData = await service.getAllTerms();
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

Controller.prototype.acceptTerms = async (req, res) => {
  try {
    let { userId } = req.body;

    let accountDetails = await service.findById(userId);
    if (!accountDetails) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('Account does not exist.'));
    }
 
    let data = {
      _id: userId,
      acceptedTnC: true,
    };

    let isUpdated = await service.updateTerms(data);
    if (!isUpdated) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('Unable to update.'));
    }
    return res
      .status(Response.success.Ok.code)
      .json(Response.success.Ok.json({ data }));
  } catch (error) {
    console.log(error);
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

module.exports= new Controller()
