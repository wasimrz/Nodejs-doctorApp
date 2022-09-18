const { query } = require("express");
const { Surgery } = require("../../commons/models/mongo/mongodb");

/********************* APPREVIEW'S REPO ***********************/

function Repository() {}

Repository.prototype.createDocument = async function(data) {
    modelName = Surgery;  
    const instance = await modelName.create(data);
    return instance ? instance.toJSON() : null;
};

//used to get all collection from specified model
Repository.prototype.getAll = async function() {
    modelName = Surgery;
    const instance = await modelName.find({});
    return instance.length ? instance : null;
};

//used to get all collection from specified model
Repository.prototype.getByName = async function(query) {
    modelName = Surgery;
    const instance = await modelName.find(query);
    return instance.length ? instance : null;
};


//used to get collection having matching words
Repository.prototype.searchByWord = async function(query) {
    modelName = Surgery;
    const instance = await Surgery.find(query);
    return instance;
  };

module.exports = new Repository();
