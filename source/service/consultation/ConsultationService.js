require('dotenv');
const repository = require('./ConsultationRepository');

function Service() {}

/***************** CONSULTATION SERVICES ***********************/
//Service to find whether problem exists or not
Service.prototype.create = async function(data) {
  console.log(data);
  return repository.addToModel(data);
};

//Service to find whether problem exists or not
Service.prototype.findById = async function(id) {
  return repository.findConsultation(id);
};

//To find consultation details based on doctor and userId
Service.prototype.findByDoctor = async function(doctorId, userId) {
  return repository.findDetails(doctorId, userId);
};

//To find the consultation by userId
//getConsultationDetails --> return data or null
Service.prototype.findByUserId = async function(id) {
  return repository.getConsultationDetails(id);
};

Service.prototype.updateConsultation = async function(data) {
  return repository.updateConsultation(data);
};

Service.prototype.maintaingPreviousMeds = function(consultationDetails, meds) {
  //maintaing previous meds
  let sNumber = 0;
  consultationDetails.meds.forEach(element => {
    element.isLatest = false;
    sNumber = sNumber > element.sNumber ? sNumber : element.sNumber;
  });
  let medsDetails = [{ name: meds }, ...consultationDetails.meds];
  //If i concerning with same doctor then i will edit consultaion, not create new one, so just make sNumber =1 and islatest = true at time of addition;
  medsDetails[0].sNumber = sNumber + 1;
  medsDetails[0].isLatest = true;
  return medsDetails;
};

Service.prototype.maintaingPreviousValues = function(oldValues, newValues) {
  //maintaing previous values
  let sNumber = 0;

  //for oldValues
  if (oldValues) {
    oldValues.forEach(element => {
      element.isLatest = false;
      sNumber = sNumber > element.sNumber ? sNumber : element.sNumber;
    });
  }

  let newDetails = [];
  newValues.forEach(element => {
    newDetails.push({ details: element, sNumber: sNumber + 1, isLatest: true });
    sNumber++;
  });

  newDetails = [...newDetails, ...oldValues];

  //If i concerning with same doctor then i will edit consultaion, not create new one, so just make sNumber =1 and islatest = true at time of addition;

  return newDetails;
};

module.exports = new Service();
