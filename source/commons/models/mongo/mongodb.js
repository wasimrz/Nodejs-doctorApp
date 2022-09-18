const Account = require('./documents/account');
const User = require('./documents/user');
const Problem = require('./documents/problem');
const Doctor = require('./documents/doctor');
const Consultation = require('./documents/consulatation');
const Banner = require('./documents/banner');
const Insurance = require('./documents/insurance');
const Insurancesubmission = require('./documents/insurancesubmission');
const AppReview = require('./documents/appReview');
const Problems = require('./documents/problemModel');
const Appointment = require('./documents/appointment');
const Policy = require('./documents/policy');
const Test = require('./documents/test');
const Terms = require('./documents/termsncond');
const Medicines = require('./documents/medicine');
const Invitations = require('./documents/invitation');
const Surgery = require('./documents/surgery');
const JobApplicant = require('./documents/jobApplicant')

module.exports = {
  Account,
  User,
  Problem,
  Test,
  Doctor,
  Insurance,
  AppReview,
  Appointment,
  Consultation,
  Banner,
  Insurancesubmission,
  Problems,
  Policy,
  Medicines,
  Invitations,
  Terms,

  Surgery,
  JobApplicant
};
