const { JobApplicant } = require('../../commons/models/mongo/mongodb');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const smsObj = require('../../commons/mailer/mailer.js');


function Repository() {}

/********************* JobApplicant'S REPO ***********************/

Repository.prototype.createDocument = async function (data) {
  const modelName = JobApplicant;
  const instance = await modelName.create(data);
  return instance ? instance.toJSON() : null;
};

Repository.prototype.getAll = async function () {
  const modelName = JobApplicant;
  const instance = await modelName.find({});
  return instance.length ? instance : null;
};

Repository.prototype.getById = async function (id) {
  const modelName = JobApplicant;
  const instance = await modelName.findOne({ _id: id });
  return instance ? instance.toJSON() : null;
};

//used to findOne and update the document
Repository.prototype.getByIDAndUpdate = async function (query, updation) {
  const modelName = JobApplicant;
  const instance = await modelName.findOneAndUpdate(query, updation, {
    new: true,
  });

  return instance ? instance.toJSON() : null;
};

Repository.prototype.getByFilter = async function(filter){
  const modelName = JobApplicant;
  const instance = await modelName.find(filter);
  return instance.length ? instance : null; 
}



//Send the Otp through mail
Repository.prototype.sendOTPThroughEmail = async function(email, otp, name) {
  /*********** SENDING OTP TO THE USER'S EMAIL *********/
  let file = ``,
    subject = ``;

  //Register template
  if (name == 'Register') {
    file = path.join(
      __dirname,
      '../../views/templates/registerEmailTemplate.html'
    );
    subject = 'Here comes your Signup (New User) OTP';
  }

  //Login template
  if (name == 'Login') {
    file = path.join(
      __dirname,
      '../../views/templates/loginEmailTemplate.html'
    );
    subject = 'Here comes your Login OTP';
  }

  //ForgetPassword template
  if (name == 'ForgetPassword') {
    file = path.join(
      __dirname,
      '../../views/templates/forgetpasswordEmailTemplate.html'
    );
    subject = 'Here comes your Login OTP';
  }

  //App link template
  if (name == 'AppLink') {
    file = path.join(
      __dirname,
      '../../views/templates/applinkEmailTemplate.html'
    );
    subject = 'Here comes the Doctor-Dentist App link for you';
  }

  await fs.readFile(file, 'utf8', async function(error, data) {
    data = ejs.render(data, { USEROTP: otp });

      // smsObj.sendTransactionalEmail(data);
    smsObj.sendTransactionalEmail({
      to: email,
      subject: subject,
      template: data
    });
    if (error) {
      throw error;
    }
  });
};

module.exports = new Repository();
