const {
    Problems
} = require('../../commons/models/mongo/mongodb');
function Repository() {}

Repository.prototype.createDoc = async function (data) {
    const instance = await Problems.create(data);
    return instance ? instance.toJSON() : null;
}

Repository.prototype.getAllProblem = async function (query) {
    const instance = await Problems.find(query).exec();
    return instance.length>0 ? instance : [];
}

Repository.prototype.getProlem=async function(query){
    const instance = await Problems.findOne(query).exec();
    return instance ? instance.toJSON() : null;
}
module.exports = new Repository();