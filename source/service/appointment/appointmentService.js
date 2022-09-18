require('dotenv');
const OAuth2 = require('../../commons/auth/OAuth2');
const repository = require('./appointmentRepository');
const { Context } = require('../../commons/context/dbContext');
const {
  Mailer,
  ResourceAPI
} = require('../../commons/externals/externalsManager');
const { crypto, datetime } = require('../../commons/util/UtilManager');
const { API } = require('../../commons/config/ConfigManager');
const logger = require('../../commons/logger/logger');
const { Appointment } = require('../../commons/models/mongo/mongodb');
const mongoose = require('mongoose');
function Service() {}
const {
  crypto: CryptoUtil,
  utility: GeneralUtil
} = require('../../commons/util/UtilManager');
const envproperties = require('../../properties.json');
const encoder = require('urlencode');
const smsObj = require('../../commons/mailer/mailer.js');

Service.prototype.findAppointment = async function(appointmentId) {
  return repository.getAppointmentById(appointmentId);
};


Service.prototype.findPatient = async function (docterId) {
  return repository.getPatientById(docterId);
};

Service.prototype.getAll = async function (query) {
  return repository.getAllAppointment(query);
};

Service.prototype.createAppointment = async function(req) {
  let obj = {
    _id: new mongoose.Types.ObjectId().toHexString(),
    updatedAt: new Date(),
    createdAt: new Date(),
    patientName: req.patientName,
    patientAge: req.patientAge,
    scheduleDate: req.scheduleDate,
    problem: req.problem,
    test: req.test,
    userId: req.userId,
    doctorId: req.doctorId,
    appointmentType: req.appointmentType
  };
  return await repository.createDoc(obj);
};

Service.prototype.updateUser = async function(userId, data) {
  return await repository.updateUserById(userId, data);
};

Service.prototype.cancelAppointment = async function(appointmentId) {
  return repository.cancelById(appointmentId);
};

Service.prototype.rescheduleAppointment = async function(
  appointmentId,
  scheduleDate
) {
  return repository.rescheduleById(appointmentId, scheduleDate);
};

Service.prototype.makeSlotAvailable = async function(
  scheduleDetails,
  doctorId
) {
  return repository.makeSlotAvailable(scheduleDetails, doctorId);
};

Service.prototype.validateDoctorAvailability = async function(
  doctorDetails,
  askTime
) {
  return repository.validateAvailability(doctorDetails, askTime);
};
module.exports = new Service();
