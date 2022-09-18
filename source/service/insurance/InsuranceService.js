const repository    = require('./InsuranceRepository');
const mongoose = require('mongoose');

function Service(){} 

Service.prototype.addInsurance = async function (req) {
    const logo = req.file.location;
    const  name  = req.body.name;
    if(logo != null && name != null){
      let dataObj = {
        _id:new mongoose.Types.ObjectId().toHexString(),
        logo:logo,
        name:name
      };
      const insurance = await repository.createInsurance(dataObj);
      if(insurance != null){
        let data = insurance;
        return data;
      }else{
        return false;
      }
    }else{
        return false;
    }
}

Service.prototype.getAllInsurance = async function(){
  const insurance = await repository.getAllInsurance();
  return insurance;
}

module.exports = new Service();
