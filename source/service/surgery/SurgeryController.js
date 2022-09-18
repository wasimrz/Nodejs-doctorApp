const Response  = require("../../commons/responses/EcomResponseManager");
const logger    = require("../../commons/logger/logger");
const service   = require("./SurgeryService");

function Controller() {}

Controller.prototype.createSurgery = async function(req, res) {
    try {
        if(req.file != null){
          const data = await service.addSurgery(req);
          if (data) {
              res.status(Response.success.Ok.code).json(Response.success.Ok.json({
                message: 'Surgery added successfully',
                data: data,
              }));
            } else {
              res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json(
                'Failed to add the surgery'
              ));
            };
        }else {
          res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json(
            'Please Select a file to upload'
          ));
        };
    }catch(e) {
        logger.error(e.message);
        console.log(e);
        res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());

    }

}

Controller.prototype.getAllSurgeries = async function(req, res) {
  try {
      let data = await service.getAllSurgeries();
      return res.status(Response.success.Ok.code).json(
          Response.success.Ok.json({
            data: data,
          })
        );

  }catch(e ){
      logger.error(e.message);
      console.log(e);
      res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }

}

Controller.prototype.searchSurgeries = async function(req, res) {
  try {
    let data = await service.searchSurgeries(req);
    return res.status(Response.success.Ok.code).json(
        Response.success.Ok.json({
          data: data,
        })
      );
  }catch(e) {
    logger.error(e.message);
    console.log(e);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());

  }
}


module.exports = new Controller();
