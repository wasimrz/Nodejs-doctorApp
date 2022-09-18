const Response = require("../../commons/responses/EcomResponseManager");
const logger = require("../../commons/logger/logger");
const service = require("./BannerService");
const { S3 } = require('../../commons/util/UtilManager');

function Controller() {}

/*****************************  DOCTOR'S APIS *******************************/
//adding doctors
Controller.prototype.add = async function (req, res, next) {
  try {
    //Validating problem and test details
    let { _id, rowLocation,redirectLink } = req.body;

  if (req.files && req.files.image) {
      var file = await S3.doUpload(req.files.image, 'banner');
    } 
   
    let isBannerAdded = await service.addDetails(
      { _id,file, rowLocation, redirectLink},
      "Banner"
    );

    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: {
          image: isBannerAdded.file,
          rowLocation: isBannerAdded.rowLocation,
          redirectLink: isBannerAdded.redirectLink
        },
      })
    );
  } catch (e) {
    console.log(e);
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
};

//Listing all banners
Controller.prototype.getBanners = async function (req, res, next) {
  try {
    let allBanner = await service.getAllBanners("Banner");
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: allBanner,
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
};



module.exports = new Controller()
