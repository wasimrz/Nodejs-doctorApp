const express = require('express');
const router = express.Router();
const ServiceManager = require('../../service/ServiceManager');
const { profileImage }  = require('../../commons/util/fileUpload/upload'); 


router.use(express.json());

/**************  Career ROUTES ***************/

router.post('/login/otp', ServiceManager.career.requestOtp);
router.post('/login/validate', ServiceManager.career.validateAndLoginApplicant);
router.post('/apply/:userId', profileImage.single('resume'),  ServiceManager.career.submitApplication);

module.exports = router;
