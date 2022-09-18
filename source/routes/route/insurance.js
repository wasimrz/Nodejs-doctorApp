const express           = require('express');
const router            = express.Router();
const passport          = require('../../commons/auth/Passport');
const { profileImage }  = require('../../commons/util/fileUpload/upload'); 
const ServiceManager    = require('../../service/ServiceManager');

router.use(express.json());
router.post("/submitDetails", ServiceManager.insurance.add);
router.post('/create', profileImage.single('logo'), ServiceManager.insurance.createInsurance);
router.get('/list', ServiceManager.insurance.getAllInsurances);

module.exports = router;