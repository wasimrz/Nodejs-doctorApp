const {Test}=require('../../commons/models/mongo/mongodb');
const mongoose=require('mongoose');
const service = require('./TestService');
  
function Controller() { }

Controller.prototype.listTest=async function(){
    try{
        const test=await Test.find().exec();
        if (test) {
            res.status(Response.success.Ok.code).json(Response.success.Ok.json({
              message: 'Test list fetched successfully',
              test: test,
            }));
          } else {
            res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json(
              'Due to some issue, test was not fetched'
            ));
          };
        return test;
    }catch(e){
        return res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json());
    }
    
}

Controller.prototype.create=async function(req,res,next){
    try {
        const test = await service.createTest(req);
        if (test) {
          res.status(Response.success.Ok.code).json(Response.success.Ok.json({
            message: 'Test is created successfully',
            test: test,
          }));
        } else {
          res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json(
            'Test creation failed'
          ));
        };
      } catch (e) {
        logger.error(e.message);
        res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
      }
}

module.exports=new Controller();
