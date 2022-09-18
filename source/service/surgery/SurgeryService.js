require('dotenv');
const mongoose = require('mongoose');
const repository = require('./SurgeryRepository');

function Service() {}

Service.prototype.addSurgery = async function (req) {
  let icon = req.file.location;
  let { surgeryName, surgeryDescription, price } = req.body;

  if (icon != null) {
    let query = { surgeryName: surgeryName };
    let getSurgeryByName = await repository.getByName(query);
    if (getSurgeryByName != null) {
      let result = {
        msg: ' Surgery Already Exists',
      };
      return result;
    }
    let dataObj = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      icon: icon,
      surgeryName: surgeryName,
      surgeryDescription: surgeryDescription,
      price: price,
    };
    const surgeryData = await repository.createDocument(dataObj);
    if (surgeryData != null) {
      let data = surgeryData;
      return data;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

Service.prototype.getAllSurgeries = async function () {
  const surgeries = await repository.getAll();
  return surgeries;
};

Service.prototype.searchSurgeries = async function (req) {
  const query = { $text: { $search: req.params.word } };
  const surgeries = await repository.searchByWord(query);
  let result = {};
  if (surgeries.length == 0) {
    result = {
      surgeries: surgeries,
      msg: 'No Results Found',
    };
  } else {
    result = {
      surgeries: surgeries,
      msg: 'Got some results for you',
    };
  }
  return result;
};

module.exports = new Service();
