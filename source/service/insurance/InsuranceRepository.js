const { Insurance } = require("../../commons/models/mongo/mongodb");

function Repository () {}

/********************* DOCTOR'S REPO ***********************/


Repository.prototype.createDocument = async function (dataObj) {
    modelName = Insurance;
    const instance = await modelName.create(dataObj);
    return instance;

}

Repository.prototype.getAllInsurance = async function() {
    let data = await Insurance.find().exec();
    return data;
}

module.exports = new Repository();
