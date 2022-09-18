// const problemModel = require('../../commons/models/mongo/documents/problemModel')
const logger   = require('../../commons/logger/logger');
const Response = require('../../commons/responses/EcomResponseManager');
const {
  Context: DBContext
} = require('../../commons/context/dbContext');
const {
  ds,
  url,
} = require('../../commons/util/UtilManager');
const {
  crypto
} = require('../../commons/util/UtilManager');
const service = require('./problemService');

function Controller() { }

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}


Controller.prototype.problem = async function (req, res,next) {
    try {
        const { problemName, description, icons, displayName } = req.body
        if (!isValid(problemName))
        return res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json("Please enter problemName"));
        let problemFind=await service.findProblem({problemName:problemName})
        if (problemFind) 
        return res.status(Response.error.AlreadyExist.code).json(Response.error.AlreadyExist.json('Problem already exists'));
        if (description && !isValid(description))
        return res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json("Please enter description"));
        if (!isValid(icons))
        return res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json("Please enter icons" ))
        if (displayName && !isValid(displayName))
        return res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json("Please enter display name" ))
        let obj = {
            problemName:problemName,
            description:description,
            icons:icons,
            displayName:displayName
        }
        let created = await service.createAProblem(obj)
        return res.status(Response.success.Ok.code).json(Response.success.Ok.json({
            message: 'Created successfully',
            data: created
        }));
    } catch (err) {
        logger.error(err.message);
        return res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
    }
}

Controller.prototype.list = async function (req, res,next) {
    try {
        let listData = await service.findAllProblem({})

        if (listData.length==0) {
            return res.status(Response.error.NotFound.code).json(Response.error.NotFound.json("List data is empty"));
        }
        return res.status(Response.success.Ok.code).json(Response.success.Ok.json({
            message: 'List found successfully',
            data: listData
        }));    
    }
    catch (error) {
        logger.error(error.message);
        return res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());    
    }
}


module.exports = new Controller();