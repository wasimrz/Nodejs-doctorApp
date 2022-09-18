const Test = require("../../commons/models/mongo/mongodb");
const mongoose = require('mongoose');


function Repository () {}

Repository.prototype.createTest=async function(testObj){

    const test=new Test();

    const testId=new mongoose.Types.ObjectId().toHexString();
    test._id=testId;
    test.testName=testObj.testName;
    test.description=testObj.description;
    test.icons=testObj.icons;
    test.displayname=testObj.displayname;

    await test.save();

    return testId; 
}

module.exports = new Repository();