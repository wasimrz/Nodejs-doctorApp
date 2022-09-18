const Response  = require("../../commons/responses/EcomResponseManager");
const logger    = require("../../commons/logger/logger");
const service   = require("./AppService");

function Controller() {}

//Add App Review
Controller.prototype.addAppReview = async function(req, res, next){
    try{
        let data = await service.createAppReview(req);
        return res.status(Response.success.Ok.code).json(
          Response.success.Ok.json({
            data: data,
          })
        );

    }catch(e){
        logger.error(e.message);
        console.log(e);
        res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
    }

}


//List All App Review
Controller.prototype.getReviews = async function(req, res, next){
    try{
        let data = await service.getAppReview();
        return res.status(Response.success.Ok.code).json(
            Response.success.Ok.json({
              data: data,
            })
          );
  
    }catch(e){
        logger.error(e.message);
        console.log(e);
        res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
    }
}


//Like the review
Controller.prototype.likeReview = async function(req, res, next){
    try{
        let data = await service.likeAppReview(req);
        return res.status(Response.success.Ok.code).json(
            Response.success.Ok.json({
              data: data,
            })
          );

    }catch(e){
        logger.error(e.message);
        console.log(e);
        res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());

    }

}

//Dislike the Review
Controller.prototype.dislikeReview = async function(req, res, next){
    try{
        let data = await service.dislikeAppReview(req);
        return res.status(Response.success.Ok.code).json(
            Response.success.Ok.json({
              data: data,
            })
          );

    }catch(e){
        logger.error(e.message);
        console.log(e);
        res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());

    }

}


module.exports = new Controller();
