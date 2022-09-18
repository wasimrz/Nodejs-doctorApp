module.exports = {
  login: require('./login/LoginController'),
  logout: require('./logout/LogoutController'),
  user: require('./user/UserController'),
  doctor: require('./doctor/DoctorController'),
  insurance: require('./insurance/InsuranceController'),
  app: require('./app/AppController'),
  appointment: require('./appointment/appointmentController'),
  consultation: require('./consultation/ConsultationController'),

  problem:require('./problems/problemController'),
  banner:require('./banner/BannerController'),
  admin:require('./admin/AdminController'),
  policy:require('./policy/policyController'),
  terms:require('./terms/termsController'),
  test: require('./test/TestController'),
  surgery: require('./surgery/SurgeryController'),
  career: require('./career/CareerController')
};
