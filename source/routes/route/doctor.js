const express = require('express');
const router = express.Router();
const ServiceManager = require('../../service/ServiceManager');
const { profileImage }  = require('../../commons/util/fileUpload/upload'); 


router.use(express.json());

/**************  DOCTOR ROUTES ***************/
//Add doctor

router.post('/create', profileImage.single('photo'), ServiceManager.doctor.add);

//to get doctor's information
router.get('/get/:id', ServiceManager.doctor.get);

//to get all doctors information
router.get('/get', ServiceManager.doctor.getAll);

//to update doctor details
router.put('/update/:id',profileImage.any(), ServiceManager.doctor.updateProfile);

//Get Doctor
router.get('/list/:city',  ServiceManager.doctor.getCityDoctors);

/****************** PROBLEM ROUTES *********************/
//Add problem
router.post('/problem/add', ServiceManager.doctor.problemAdd);
//Listing all problems
router.get('/problem/list', ServiceManager.doctor.getProblems);
//Listing one problem with id
router.get('/problem/list/:id', ServiceManager.doctor.getProblem);

/****************** TEST ROUTES *********************/
//Add Test
router.post('/test/add', ServiceManager.doctor.testAdd);
//Listing all tests
router.get('/test/list', ServiceManager.doctor.getTests);
//Listing one test with id
router.get('/test/list/:id', ServiceManager.doctor.getTest);

/****************** Reviews ROUTES *********************/
//Add Review
router.post('/review/add', ServiceManager.doctor.addReview);
//Listing all Reviews Of a doctor
router.get('/review/list/:doctorId', ServiceManager.doctor.getReviews);
//Adding comment to the review
router.post('/review/comment/add', ServiceManager.doctor.addComment);
//Listing all the comments for a particular review
router.get(
  '/review/comment/list/:doctorId/:reviewId',
  ServiceManager.doctor.getReviewComments
);

/***************** MEDICINES ADD **********************/
//Add medicines
router.post('/medicine/create', ServiceManager.doctor.addMedicine);

//get all medicines
router.get('/medicine/list/:doctorId', ServiceManager.doctor.list);

//search medicines
router.post('/medicine/search', ServiceManager.doctor.searchMedicine);
module.exports = router;
