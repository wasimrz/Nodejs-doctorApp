const Response = require('../../commons/responses/EcomResponseManager');
const logger = require('../../commons/logger/logger');
const { User } = require('../../commons/models/mongo/mongodb');
const appointmentService = require('../appointment/appointmentService');
const doctorService = require('../doctor/DoctorService');

function validRequest(data) {
  if (Object.keys.length == 0) return true;
  else return false;
}

function validateScheduleDate(scheduleDate) {
  if (
    !scheduleDate.availabilityId ||
    !scheduleDate.day ||
    !scheduleDate.time ||
    !scheduleDate.date ||
    !scheduleDate.slotId
  ) {
    return false;
  }
  return true;
}
function Controller() {}

Controller.prototype.bookAppointment = async function(req, res, next) {
  try {
    /*
    1. Validation of req.body.
    2. Validation of mandatory fields.
    3. Validation of doctor.
    3.1 validate scheduleDate object
    4. Validation of doctor's availability.
    5. Validation of test, problems and meds.
    */

    const userRes = await User.findOne({
      'token.refresh_token': req.headers.refreshtoken || req.headers.refreshkey
    }).exec();
    if (!userRes) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('User not found'));
    }

    //1. validation of req.body
    if (validRequest(req.body)) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.InvalidRequest.json(
            'You need to filled all the details .'
          )
        );
    }

    //2. Validation of mandatory fields.
    let {
      patientName,
      patientAge,
      problem,
      test,
      doctorId,
      status,
      appointmentType,
      scheduleDate
    } = req.body;

    if (
      !patientName ||
      !patientAge ||
      !doctorId ||
      !appointmentType ||
      !problem ||
      !test ||
      !scheduleDate
    ) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json(
            'All fields patientName, patientAge, doctorId, appointmentType,scheduleDate, test and problem are mandatory.'
          )
        );
    }

    //Getting userId
    let userId = userRes._id; //req.headers.accountid;

    //3. Validation of doctor
    let isDoctorExist = await doctorService.findDoctorById(doctorId);
    if (!isDoctorExist) {
      return res
        .status(Response.error.NotFound.code)
        .json(Response.error.NotFound.json('Doctor do not exist.'));
    }

    //3.1 Validate scheduleDate object
    if (!validateScheduleDate(scheduleDate)) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json(
            'All fields day, date, availabilityId, slotId and time are mandatory.'
          )
        );
    }

    //4. Valdiation for Doctors availability
    //This methods return {} with status inside it.
    let isDoctorAvailable = await appointmentService.validateDoctorAvailability(
      isDoctorExist,
      scheduleDate
    );

    if (!isDoctorAvailable.status) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json(
            'This slot is already booked by some other patients or doctor is not available at that time.'
          )
        );
    }

    //5. validation of test and problems
    let temp = [];
    //checking problem array
    let arrayLength = problem.length;
    if (arrayLength) {
      for (let i = 0; i < arrayLength; i++) {
        let isProblemExist = await doctorService.findProblemById(
          problem[i]._id
        );
        if (isProblemExist) temp.push(problem[i]);
      }
    }
    problem = temp;
    temp = [];
    //checking test array
    arrayLength = test.length;
    if (arrayLength) {
      for (let i = 0; i < arrayLength; i++) {
        let isTestExist = await doctorService.findTestById({
          _id: test[i]._id
        });
        if (isTestExist) temp.push(test[i]);
      }
    }
    test = temp;

    //updating problem and test
    req.body.problem = problem;
    req.body.test = test;
    req.body.userId = userId;

    let bookAppointments = await appointmentService.createAppointment(req.body);
    let updateUserData = await appointmentService.updateUser(
      { _id: bookAppointments.userId },
      { $push: { appointmentDetails: bookAppointments } }
    );
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: bookAppointments,
        message: 'Appointment bokked successfully .'
      })
    );
  } catch (error) {
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.listAppointments = async function(req, res, next) {
  try {
    let allData = await appointmentService.getAll({});
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: allData,
        message: 'All apointment list fetched successfully .'
      })
    );
  } catch (error) {
    console.log(error);
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

/*********** Listing appointment based on userId *************/
Controller.prototype.getAppointmentDeatils = async function(req, res) {
  try {
    /*
    1. Getting userId
    2. get all the appointments of user
    */
    //1. Getting Id
    let userId = req.headers.accountid;

    //2. Getting appointments
    let details = await appointmentService.getAll({ userId });
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: details,
        message: 'List of your appointments fetched successfully .'
      })
    );
  } catch (error) {
    console.log(error);
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

/*********** Cancel appointment. *************/
Controller.prototype.cancelAppointment = async function(req, res) {
  try {
    /*
    Validation of appointmentId, then
    1. Getting userId
    2. get details of the appointments with appointmentId and check if its for user or not.
    3. check whether its already completed or not.
    4. cancel, if everything right.
    5. update slot information again for availability.
    */

    //Validation of appointment Id
    let appointmentId = req.body.appointmentId;
    if (!appointmentId) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('AppointmentId is mandatory.'));
    }

    //1. Getting Id
    let userId = req.headers.accountid;

    //2. Getting appointment by appointmentId
    let details = await appointmentService.findAppointment(appointmentId);
    if (!details) {
      return res
        .status(Response.error.NotFound.code)
        .json(Response.error.NotFound.json('Appointment not exist.'));
    }

    if (details.userId != userId) {
      return res
        .status(Response.error.NotFound.code)
        .json(
          Response.error.NotFound.json(
            'This appointmnet does not belongs to the user.'
          )
        );
    }

    //3. Is it completed or not ?
    if (details.isCompleted) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json("User's appointment is completed.")
        );
    }

    // Is it already cancelled ?
    if (details.isCancelled) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json(
            "User's apponitment is already cancelled."
          )
        );
    }

    //4. cancel, apppointment
    appointmentService.cancelAppointment(appointmentId);

    //5. making doctor's slot available for that time.
    appointmentService.makeSlotAvailable(
      details.scheduleDate,
      details.doctorId
    );
    details.isCancelled = true;
    details.isUpcoming = false;
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: details,
        message: 'Appointment cancelled successfully.'
      })
    );
  } catch (error) {
    console.log(error);
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

/************************** RESCEDULE APPOINTMENT **************************************/
Controller.prototype.rescheduleAppointment = async function(req, res) {
  try {
    /*
    Validation of appointmentId and scheduleDate info, then
    1. Getting userId and scheduleDate info
    2. get details of the appointments with appointmentId and check if its for user or not. 
    3. check whether its already completed or not.
      3.1 validate doctors availability for new time.
      3.2 Validate scheduleDate object
    4. reschedule, if everything right.
    5. update slot information again for availability.
    */

    //Validation of appointment Id
    let appointmentId = req.body.appointmentId;
    let scheduleDate = req.body.scheduleDate;
    if (!appointmentId || !scheduleDate) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json(
            'AppointmentId and ScheduleDate are mandatory.'
          )
        );
    }

    //1. Getting Id
    let userId = req.headers.accountid;

    //2. Getting appointment by appointmentId
    let details = await appointmentService.findAppointment(appointmentId);
    if (!details) {
      return res
        .status(Response.error.NotFound.code)
        .json(Response.error.NotFound.json('Appointment not exist.'));
    }

    if (details.userId != userId) {
      return res
        .status(Response.error.NotFound.code)
        .json(
          Response.error.NotFound.json(
            'This appointmnet does not belongs to the user.'
          )
        );
    }

    //3. Is it completed or not ?
    if (details.isCompleted) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json("User's appointment is completed.")
        );
    }

    // Is it already cancelled ?
    if (details.isCancelled) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json(
            "User's apponitment is already cancelled."
          )
        );
    }

    //3.1. Valdiation for Doctors availability
    //This methods return true/false.
    // Validation of doctor
    // we are checking doctor exist or not because we need its detials.
    //doctor is available as we able to reschedule, hence it is exist.
    let isDoctorExist = await doctorService.findDoctorById(details.doctorId);
    if (!isDoctorExist) {
      return res
        .status(Response.error.NotFound.code)
        .json(Response.error.NotFound.json('Doctor do not exist.'));
    }

    //3.2 Validate scheduleDate object
    if (!validateScheduleDate(scheduleDate)) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json(
            'All fields day, date, availabilityId, slotId and time are mandatory.'
          )
        );
    }
    let isDoctorAvailable = await appointmentService.validateDoctorAvailability(
      isDoctorExist,
      scheduleDate
    );

    if (!isDoctorAvailable.status) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json(
            'This slot is already booked by some other patients or doctor is not available at that time.'
          )
        );
    }

    //4. reschedule appointment
    appointmentService.rescheduleAppointment(appointmentId, scheduleDate);

    //5. making doctor's slot available for that time.
    appointmentService.makeSlotAvailable(
      details.scheduleDate,
      details.doctorId
    );

    details.scheduleDate = scheduleDate;
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: details,
        message: 'Appointment rescheuled successfully.'
      })
    );
  } catch (error) {
    console.log(error);
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};


Controller.prototype.getPatients = async function (req, res, next) {
  try {
    let id = req.params.doctorId;

    let allPatients = await service.findAllPatients(id);
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: allPatients,
      })
    );
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
};
module.exports = new Controller();
