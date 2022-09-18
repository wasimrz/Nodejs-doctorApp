const doctorService = require('./../doctor/DoctorService');
const Response = require('../../commons/responses/EcomResponseManager');
const logger = require('../../commons/logger/logger');
const service = require('./ConsultationService');
function Controller() {}

/******************  CONSULTATION APIS**************************/

//Add consultation
Controller.prototype.add = async (req, res) => {
  try {
    //gettting userId
    const userId = req.headers.accountid;
    //let userId = 123445;
    //getting all other details
    let {
      _id,
      name,
      doctorId,
      appointmentId,
      summary,
      dateTime,
      meds, //[array of medicine names from frontend]
      test,
      problem
    } = req.body;

    //validating manatory fields
    if (
      (!_id || !name,
      !doctorId || !appointmentId || !summary || !meds || !test || !problem)
    ) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json(
            'All fields _id, name, doctorId, appointmentId, summary, meds, test and problem are mandatory.'
          )
        );
    }

    //assignment of dateTime
    dateTime = dateTime ? dateTime : Date.now();

    //validating whether doctot exist or not.
    const isDoctorExist = await doctorService.findDoctorById(doctorId);
    if (!isDoctorExist) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('Doctor not exist.'));
    }

    //validating is doctor consultaion details already exist?
    const isConsulationExist = await service.findByDoctor(doctorId, userId);

    //isConsulationExist = true, if exist
    if (isConsulationExist) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json(
            'Consultation with doctor already exist.'
          )
        );
    }

    let temp = [];
    //checking problem array
    let arrayLength = problem.length;
    if (arrayLength) {
      for (let i = 0; i < arrayLength; i++) {
        let isProblemExist = await doctorService.findProblemById(
          problem[i]._id
        );
        if (isProblemExist)
          temp.push({
            details: problem[i],
            sNumber: i + 1,
            isLatest: true
          });
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
        if (isTestExist)
          temp.push({ details: test[i], sNumber: i + 1, isLatest: true });
      }
    }
    test = temp;

    //meds
    if (!meds.length) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('meds length cannot be zero'));
    }

    //validating data
    if (!meds.length) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json('Alteast one medicine must be there.')
        );
    }

    let medsDetails = { name: meds };
    //If i concerning with same doctor then i will edit consultaion, not create new one, so just make sNumber =1 and islatest = true at time of addition;
    medsDetails.sNumber = 1;
    medsDetails.isLatest = true;

    //adding detais to consulatation model
    const isAdded = await service.create({
      _id,
      name,
      doctorId,
      userId,
      appointmentId,
      summary,
      dateTime,
      meds: medsDetails,
      problem,
      test
    });

    //isAdded = data in case of success, else null
    if (!isAdded) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('Unable to add consultation.'));
    }

    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: isAdded
      })
    );
  } catch (error) {
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};
Controller.prototype.list = async (req, res) => {
  try {
    //Getting userId
    const userId = req.headers.accountid;
    //let userId = '123445';
    //getting consultation details of all doctors
    let consultationDetails = await service.findByUserId(userId);
    if (!consultationDetails) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('Unable to get information.'));
    }

    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: consultationDetails
      })
    );
  } catch (error) {
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};
Controller.prototype.edit = async (req, res) => {
  try {
    let {
      consultationId,
      name,
      doctorId,
      appointmentId,
      summary,
      dateTime,
      meds, //[array of medicine names from frontend]
      problem,
      test
    } = req.body;

    //validating consultationId
    let consultationDetails = await service.findById(consultationId);
    if (!consultationDetails) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('ConsultationId not exist.'));
    }
    //assignment of dateTime
    dateTime = dateTime ? dateTime : Date.now();

    //validating whether doctot exist or not.
    if (doctorId) {
      const isDoctorExist = await doctorService.findDoctorById(doctorId);
      if (!isDoctorExist) {
        return res
          .status(Response.error.Forbidden.code)
          .json(Response.error.Forbidden.json('Doctor not exist.'));
      }
    }

    let temp = [],
      problemDetails,
      testDetails,
      medDetails;

    //checking problem array
    let arrayLength = problem.length;
    if (arrayLength) {
      for (let i = 0; i < arrayLength; i++) {
        let isProblemExist = await doctorService.findProblemById(
          problem[i]._id
        );
        if (isProblemExist) temp.push(problem[i]);
      }
      problem = temp;

      //problem previous + new description
      problemDetails = service.maintaingPreviousValues(
        consultationDetails.problem, //old problem array
        problem //new problem array
      );
    }

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
      test = temp;
      //test previous + new description
      testDetails = service.maintaingPreviousValues(
        consultationDetails.test, //old test
        test //new test
      );
    }

    if (meds && meds.length) {
      //meds previous + new description
      medDetails = service.maintaingPreviousMeds(consultationDetails, meds);
    }

    let data = {
      consultationId,
      name: name ? name : consultationDetails.name,
      doctorId: doctorId ? doctorId : consultationDetails.doctorId,
      appointmentId: appointmentId
        ? appointmentId
        : consultationDetails.appointmentId,
      summary: summary ? summary : consultationDetails.summary,
      dateTime: dateTime ? dateTime : consultationDetails.dateTime,
      meds: medDetails,
      problem: problemDetails,
      test: testDetails
    };

    let isUpdated = await service.updateConsultation(data);
    if (!isUpdated) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('Unable to update.'));
    }
    return res
      .status(Response.success.Ok.code)
      .json(Response.success.Ok.json({ data }));
  } catch (error) {
    console.log(error);
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

module.exports = new Controller();
