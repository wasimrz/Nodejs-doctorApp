const Response = require('../../commons/responses/EcomResponseManager');
const logger = require('../../commons/logger/logger');
const service = require('./DoctorService');
const mongoose = require('mongoose');
const { crypto, utility } = require('./../../commons/util/UtilManager');

function Controller() {}

/*****************************  DOCTOR'S APIS *******************************/
//adding doctors
// Controller.prototype.add = async function(req, res, next) {
//   try {
//     /*
//     availability is important paramter that contains information of doctors availability.
//     format:  [
//       {
//         day: 'Monday',
//         slot: [
//           { time: '2:00 PM', isAvailable: 1 },
//           { time: '9:00 AM', isAvailable: 1 }
//         ]
//       },
//       {},
//       {}
//     ];
//     */
//     //Validating problem and test details
//     let {
//       _id,
//       firstName,
//       lastName,
//       location,
//       qualification,
//       problem,
//       test,
//       availability
//     } = req.body;

//     //Validating availability, if we have correct data we add them.
//     //After filtering if we get zero data, we retun error
//     if (!availability || !availability.length)
//       return res
//         .status(Response.error.InvalidRequest.code)
//         .json(
//           Response.error.InvalidRequest.json(
//             'Please enter valid availabilities.'
//           )
//         );
//     availability = service.validateAvailability(availability);

//     if (!availability.length) {
//       return res
//         .status(Response.error.InvalidRequest.code)
//         .json(
//           Response.error.InvalidRequest.json(
//             'Please enter valid availabilities.'
//           )
//         );
//     }

//     let temp = [];
//     //checking problem array
//     let arrayLength = problem.length;
//     if (arrayLength) {
//       for (let i = 0; i < arrayLength; i++) {
//         let isProblemExist = await service.findProblemById(problem[i]._id);
//         if (isProblemExist) temp.push(problem[i]);
//       }
//     }
//     problem = temp;
//     temp = [];
//     //checking test array
//     arrayLength = test.length;
//     if (arrayLength) {
//       for (let i = 0; i < arrayLength; i++) {
//         let isTestExist = await service.findTestById({ _id: test[i]._id });
//         if (isTestExist) temp.push(test[i]);
//       }
//     }
//     test = temp;

//     //Adding doctors information

//     let isDoctorAdded = await service.addDetails(
//       {
//         _id,
//         firstName,
//         lastName,
//         location,
//         qualification,
//         problem,
//         test,
//         availability
//       },
//       'Doctor'
//     );

//     return res.status(Response.success.Ok.code).json(
//       Response.success.Ok.json({
//         data: {
//           firstName: crypto.decrypt(isDoctorAdded.firstName),
//           lastName: crypto.decrypt(isDoctorAdded.lastName),
//           location: isDoctorAdded.location,
//           qualifications: isDoctorAdded.qualifications,
//           problem: isDoctorAdded.problem,
//           test: isDoctorAdded.test,
//           availability: isDoctorAdded.availability
//         }
//       })
//     );
//   } catch (e) {
//     console.log(e);
//     logger.error(e.message);
//     res
//       .status(Response.error.InternalError.code)
//       .json(Response.error.InternalError.json());
//   }
// };

//adding doctors
Controller.prototype.add = async function (req, res) {
  try {
    let data = await service.addDoctorDetails(req);
    res.status(Response.success.Ok.code).json(Response.success.Ok.json({
      message: 'Doctor added successfully',
      data: data,
    }));
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
};

//Generate otp for verification
Controller.prototype.generateOtp = async function(req, res, next) {
  try {
    /*
    1. Validate email, phone and code exist or not ?
    2. Valaidate email and phone exist or not?
    3. If exist check for code, is code valid?
    4. If correct send otp to both email and phone.
    */

    //1. Validate email, phone and code exist or not ?
    let { email, code, mobileNumber } = req.body;

    //validate email and phone
    if (!email || !code) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.InvalidRequest.json(
            'email and code are mandatory fields.'
          )
        );
    }

    if (
      utility.isValidEmail(email) == false &&
      (email === undefined) == false
    ) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(Response.error.Forbidden.json('Please enter a valid email ...'));
    }

    if (
      utility.isValidMobileNumber(mobileNumber) == false &&
      (mobileNumber === undefined) == false
    ) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.Forbidden.json(
            'Please enter a valid mobile number ...'
          )
        );
    }

    //2. Validate email and phone exist or not?
    isValid = await service.validateDetails({ email, mobileNumber, code });
    if (!isValid) {
      res
        .status(Response.error.NotFound.code)
        .json(Response.error.NotFound.json());
    }

    //4. If correct send otp to both email and phone.
    const otp = await service.generateLoginOTP();

    const msg = await service.prepareOTPMessage(
      { mobile: mobileNumber, email },
      otp
    );

    // send email and sms
    await service.sendOTP(msg);

    //5. Update otp in the database.
    service.updateOtp(otp, isValid.id);

    //6. send info to the user.
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: isValid._id,
        message: 'OTP generated for verification'
      })
    );
  } catch (e) {
    console.log(e);
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.validateOtp = async function(req, res, next) {
  try {
    let { id, otp } = req.body;
    if (!id || !otp) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.InvalidRequest.json('id and otp are mandatory fields.')
        );
    }
    console.log(id, otp);
    let isCorrect = await service.validateOtp(id, otp);
    if (!isCorrect) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(Response.error.InvalidRequest.json('Incorrect otp.'));
    }
    res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        message: 'OTP verified'
      })
    );
  } catch (e) {
    console.log(e);
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

//To get doctors information
Controller.prototype.get = async function (req, res, next) {
  try {
    let id = req.params.id;
    /*
    1. validation of doctor's id.
    2. If its valid, return details of doctor.
    */

    //validation
    let isValid = await service.findDoctorById(id);
    if (!isValid)
      return res
        .status(Response.error.NotFound.code)
        .json(Response.error.NotFound.json("Doctor's Information not exist."));
    //decrypt doctors name
    isValid.firstName = crypto.decrypt(isValid.firstName);
    isValid.lastName = crypto.decrypt(isValid.lastName);

    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: isValid,
      })
    );
  } catch (error) {
    console.log(e);
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.getAll = async function (req, res, next) {
  try {
    /*
    1. return details of doctors.
    */

    //validation
    let isValid = await service.getAllDoctor();
    if (!isValid)
      return res
        .status(Response.error.NotFound.code)
        .json(Response.error.NotFound.json('Doctors Information not exist.'));

    //decrypt doctors name
    isValid.forEach((ele) => {
      ele.firstName = crypto.decrypt(ele.firstName);
      ele.lastName = crypto.decrypt(ele.lastName);
    });
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: isValid,
      })
    );
  } catch (error) {
    console.log(e);
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

//getting doctors
Controller.prototype.getCityDoctors = async function (req, res, next) {
  try {
    let city = req.params.city;
    let doctors = await service.getDoctorByCity(city);
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: doctors,
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

//update doctor profile
Controller.prototype.updateProfile = async function(req, res ) {
  try {
    let data = await service.getDoctorByIdAndUpdate(req);
    res.status(Response.success.Ok.code).json(Response.success.Ok.json({
      message: 'Doctor profile modified successfully',
      data: data,
    }));

  }catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
}

/******************************  PROBLEMS'S APIS *******************************/
//Adding problems
Controller.prototype.problemAdd = async function (req, res, next) {
  try {
    //Getting details from the body
    let { _id, problemName, displayName, icons } = req.body;

    let isCreated = await service.addDetails(
      { _id, problemName, displayName, icons },
      'Problem'
    );
    if (isCreated) {
      return res.status(Response.success.Ok.code).json(
        Response.success.Ok.json({
          data: {
            problemId: isCreated._id,
            problemName: isCreated.problemName,
            icons: isCreated.icons,
            displayName: isCreated.displayName,
          },
        })
      );
    }
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

//Listing all problems
Controller.prototype.getProblems = async function (req, res, next) {
  try {
    let allProblem = await service.getAllProblems('Problem');
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: allProblem,
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

//List one problem
Controller.prototype.getProblem = async function (req, res, next) {
  try {
    let id = req.params.id;
    let oneProblem = await service.findProblemById(id, 'Problem');
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: oneProblem,
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

/*****************  TEST'S APIS *********************/
//Adding Tests
Controller.prototype.testAdd = async function (req, res, next) {
  try {
    //Getting details from the body
    let { testName, displayName, icons, description, _id } = req.body;

    let isCreated = await service.addDetails(
      { _id, testName, displayName, icons, description },
      'Test'
    );
    if (isCreated) {
      return res.status(Response.success.Ok.code).json(
        Response.success.Ok.json({
          data: {
            testId: isCreated._id,
            testName: isCreated.problemName,
            icons: isCreated.icons,
            displayName: isCreated.displayName,
            description: isCreated.description,
          },
        })
      );
    }
  } catch (e) {
    console.log(e);
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

//Listing all tests
Controller.prototype.getTests = async function (req, res, next) {
  try {
    let allTests = await service.getAllTests();
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: allTests,
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

//List one test
Controller.prototype.getTest = async function (req, res, next) {
  try {
    let id = req.params.id;
    let oneTest = await service.findTestById(id, 'Test');
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: oneTest,
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

/******************************  PROBLEMS'S APIS *******************************/
//Adding Reviews

Controller.prototype.addReview = async function (req, res, next) {
  try {
    //Getting review details from body
    let {
      doctorId,
      reviewDescription,
      reviewRating,
      reviewedUserId,
      reviewedUserName,
      reviewedUserMobile,
      reviewedUserMail,
      reviewedDate,
    } = req.body;
    let reviewObj = {};
    reviewObj = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      reviewDescription: reviewDescription,
      reviewRating: reviewRating,
      reviewedUserId: reviewedUserId,
      reviewedUserName: reviewedUserName,
      reviewedUserMail: reviewedUserMail,
      reviewedUserMobile: reviewedUserMobile,
      reviewedDate: Date.now(reviewedDate),
      comments: [],
    };

    let data = await service.findDoctorByIdAndAddReview(doctorId, reviewObj);
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: data,
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

//Listing all the reviews for a particular doctor
Controller.prototype.getReviews = async function (req, res, next) {
  try {
    let id = req.params.doctorId;
    // console.log(id);
    let allReviews = await service.findAllReviews(id);
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: allReviews,
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

//Adding Comment for a review

Controller.prototype.addComment = async function (req, res, next) {
  try {
    //Getting review details from body
    let {
      doctorId,
      reviewId,
      commentDescription,
      commentedUserId,
      commentedUserName,
      commentedUserMail,
      commentedDate,
    } = req.body;
    let commentObj = {};
    commentObj = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      commentDescription: commentDescription,
      commentedUserId: commentedUserId,
      commentedUserName: commentedUserName,
      commentedUserMail: commentedUserMail,
      commentedDate: Date.now(commentedDate),
    };

    let data = await service.findReviewByIdAndAddComment(
      doctorId,
      reviewId,
      commentObj
    );
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: data,
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.getReviewComments = async function (req, res, next) {
  try {
    let doctorId = req.params.doctorId;
    let reviewId = req.params.reviewId;
    // console.log(id);
    let allReviews = await service.findAllReviewComments(doctorId, reviewId);
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: allReviews,
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

/*********************** MEDICINES RELATED APIS ********************************/
Controller.prototype.addMedicine = async function(req, res) {
  try {
    let { doctorId, name, icon, price } = req.body;

    /*
    1. validate is all mandatory fileds exits.
    2. Is doctor exist ?
    3. if everything is right, add data to the database.
    */
    //1. validate is all mandatory fileds exits.
    if (!doctorId) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.InvalidRequest.json('doctorId is mandatory field.')
        );
    }

    //2. Is doctor exist ?
    let isDoctorExist = await service.findDoctorById(doctorId);
    if (!isDoctorExist) {
      return res
        .status(Response.error.NotFound.code)
        .json(Response.error.NotFound.json('Doctor do not exist.'));
    }

    //3. if everything is right, add data to the database.
    let isAdded = await service.addDetails(
      {
        _id: new mongoose.Types.ObjectId().toHexString(),
        doctorId,
        name,
        icon,
        price
      },
      'Medicine'
    );
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: isAdded
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.list = async function(req, res) {
  try {
    let doctorId = req.params.doctorId;

    /*
    1. validate is all mandatory fileds exits.
    2. Is doctor exist ?
    3. if everything is right, get data from the database.
    */
    //1. validate is all mandatory fileds exits.
    if (!doctorId) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.InvalidRequest.json('doctorId is mandatory field.')
        );
    }

    //2. Is doctor exist ?
    let isDoctorExist = await service.findDoctorById(doctorId);
    if (!isDoctorExist) {
      return res
        .status(Response.error.NotFound.code)
        .json(Response.error.NotFound.json('Doctor do not exist.'));
    }

    //3. if everything is right, add data to the database.
    let isDataExist = await service.getAllMedicines(doctorId);
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: isDataExist
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.searchMedicine = async function(req, res) {
  try {
    let name = req.body.name;

    let details = await service.searchMedsByName(name);
    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data: details
      })
    );
  } catch (e) {
    logger.error(e.message);
    console.log(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

module.exports = new Controller();
