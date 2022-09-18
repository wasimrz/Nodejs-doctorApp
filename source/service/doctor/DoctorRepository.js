const {
  Problem,
  Test,
  Doctor,
  Invitations,
  Medicines
} = require('../../commons/models/mongo/mongodb');

function Repository() {}

/********************* DOCTOR'S REPO ***********************/

Repository.prototype.validateInformationForOTP = async function(data) {
  let searchData = {
    email: data.email,
    onBoardingCode: data.code
  };
  if (data.mobileNumber) searchData.phone = data.mobileNumber;
  return await Invitations.findOne(searchData);
};

Repository.prototype.isCorrectDetails = function(availability) {
  /*[
    {
      day: 'Monday',
      slot: [
        { time: '2:00 PM', isAvailable: 1 },
        { time: '9:00 AM', isAvailable: 1 }
      ]
    },
    {},
    {}
  ];*/

  //Only adding the correct values by making use of filters.
  let data = [];
  availability.forEach(details => {
    if (
      Object.keys(details).length &&
      details.day &&
      details.slot &&
      details.slot.length > 0
    ) {
      //this will conatins slots that are correct.
      let temp = [];
      details.slot.forEach(time => {
        if (time.time && (time.isAvailable == 0 || time.isAvailable == 1)) {
          temp.push(time);
        }
      });
      //Here we are validating that slots size should be same as temp, it means we can upload data, otherwise there will some mistake in the data
      if (temp.length == details.slot.length) data.push(details);
    }
  });

  return data;
};

/******************** PROBELM REPO *********************/

/******************** TEST REPO *********************/

/************** MEDICINES REPO  ***************/
Repository.prototype.getMedicinesByDoctorId = async function(doctorId) {
  return await Medicines.find({ doctorId });
};

Repository.prototype.searchMeds = async function(itemToSearch) {
  return await Medicines.find({
    name: { $regex: `${itemToSearch}`, $options: 'i' }
  });
};

/********************** COMMON REPO ******************/
//creating document
Repository.prototype.createDocument = async function(data, modelName) {
  if (modelName == 'Medicine') modelName = Medicines;
  else {
    modelName =
      modelName === 'Problem' ? Problem : modelName === 'Test' ? Test : Doctor;
  }
  const instance = await modelName.create(data);
  return instance ? instance.toJSON() : null;
};

//used to get all collection from specified model
Repository.prototype.getAll = async function(modelName) {
  modelName =
    modelName === 'Problem' ? Problem : modelName === 'Test' ? Test : Doctor;
  const instance = await modelName.find({});
  return instance.length ? instance : null;
};

//Used to get collection by Id
Repository.prototype.getById = async function(id, modelName) {
  modelName =
    modelName === 'Problem' ? Problem : modelName === 'Test' ? Test : Doctor;
  const instance = await modelName.findOne({ _id: id });
  return instance ? instance.toJSON() : null;
};

//used to findOne and update the document
Repository.prototype.getByIDAndUpdate = async function(
  query,
  updation,
  modelName
) {
  modelName =
    modelName === 'Problem' ? Problem : modelName === 'Test' ? Test : Doctor;
  const instance = await modelName.findOneAndUpdate(query, updation, {
    new: true
  });
  return instance ? instance.toJSON() : null;
};

//used to get all collection from specified model
Repository.prototype.getByIdWithFilter = async function(
  query,
  filter,
  modelName
) {
  modelName =
    modelName === 'Problem' ? Problem : modelName === 'Test' ? Test : Doctor;
  const instance = await modelName.find(query, filter);
  return instance.length ? instance : null;
};

//used to get all collection from specified city
Repository.prototype.getByCity = async function(city, modelName) {
  modelName =
    modelName === 'Problem' ? Problem : modelName === 'Test' ? Test : Doctor;
  const instance = await modelName.find({ 'location.city': city });
  return instance.length ? instance : null;
};

Repository.prototype.addOtp = async function(otp, id) {
  return await Invitations.updateOne({ _id: id }, { otp });
};

Repository.prototype.validateData = async function(id, otp) {
  let isCorrect = await Invitations.findOne({ _id: id, otp });
  if (isCorrect) {
    await Invitations.updateOne({ _id: id }, { isVerified: true });
    return true;
  }
  return false;
};

//used to get by filter
Repository.prototype.getByFilter = async function(filter, modelName){
  modelName = modelName === "Problem" ? Problem : modelName === "Test" ? Test : Doctor;
  const instance = await modelName.find(filter);
  return instance.length ? instance : null;
  
}
module.exports = new Repository();
