require('dotenv');
const repository  = require("./problemRepository");
const { Context } = require('../../commons/context/dbContext');
const {
  crypto,
  datetime
}  = require('../../commons/util/UtilManager');
const {
  API
} = require('../../commons/config/ConfigManager');
const logger = require('../../commons/logger/logger');

function Service() {}
const mongoose = require('mongoose');

Service.prototype.createAProblem=async function (data) {
  data._id=new mongoose.Types.ObjectId().toHexString();
  return await repository.createDoc(data)
}
Service.prototype.findProblem=async function(query){
 return await repository.getProlem(query)
}

Service.prototype.findAllProblem=async function(query){
return await repository.getAllProblem(query)
}
module.exports = new Service();