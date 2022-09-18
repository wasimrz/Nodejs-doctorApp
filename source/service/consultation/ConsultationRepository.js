const { Consultation } = require('../../commons/models/mongo/mongodb');
const { crypto } = require('../../commons/util/UtilManager');

function Repository() {}

/********************* CONSULTATION'S REPO ***********************/

Repository.prototype.addToModel = async function(data) {
  const isExist = await Consultation.create(data);
  return isExist ? isExist : null;
};

Repository.prototype.findConsultation = async function(id) {
  const isExist = await Consultation.findOne({ _id: id });
  return isExist ? isExist : false;
};

Repository.prototype.findDetails = async function(doctorId, userId) {
  const isExist = await Consultation.findOne({ doctorId, userId });
  return isExist ? true : false;
};

Repository.prototype.updateConsultation = async function(data) {
  const isUpdated = await Consultation.updateOne(
    { _id: data.consultationId },
    { ...data }
  );
  return isUpdated.ok ? true : false;
};

Repository.prototype.getConsultationDetails = async function(userId) {
  let isExist = await Consultation.find({ userId })
    .populate([
      { path: 'doctorId', select: ['firstName', 'lastName'] },
      { path: 'userId', select: ['email', 'mobile'] }
    ])
    .lean(); //lean method is to convert mongoose document into JS object
  console.log('here', isExist);
  if (isExist.length) {
    isExist = isExist.map(data => {
      data.doctorId.firstName = crypto.decrypt(data.doctorId.firstName);
      data.doctorId.lastName = crypto.decrypt(data.doctorId.lastName);
      if (data.problem && data.problem.length)
        data.problem = data.problem.map(element => {
          return {
            ...element.details,
            sNumber: element.sNumber,
            isLatest: element.isLatest
          };
        });

      if (data.test && data.test.length)
        data.test = data.test.map(element => element.details);

      return data;
    });

    return isExist;
  }
  return null;
};
module.exports = new Repository();
