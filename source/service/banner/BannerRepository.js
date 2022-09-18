const { Banner } = require("../../commons/models/mongo/mongodb");

function Repository() {}

Repository.prototype.createDocument = async function (data, modelName) {
  console.log(".modelName", modelName);
  modelName = modelName === "Banner" ? Banner : '';
  console.log(".modelName", modelName);

  const instance = await modelName.create(data);
  return instance ? instance.toJSON() : null;
};

//used to get all collection from specified model
Repository.prototype.getAll = async function (modelName) {
  modelName = modelName === "Banner" ? Banner : '';
  const instance = await modelName.find({});
  return instance.length ? instance : null;
};

module.exports = new Repository();
