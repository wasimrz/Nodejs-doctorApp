require('dotenv');
const mongoose = require('mongoose');
//const encoder = require('urlencode')
const repository=require('./TestRepository');

function Service () {}

Service.prototype.validateAndReg = async function (testObj) {
    const test=await repository.createTest(testObj);

    return test;
};
  
module.exports = new Service();