const express           = require('express');
const router            = express.Router();
const { profileImage }  = require('../../commons/util/fileUpload/upload'); 
const ServiceManager    = require('../../service/ServiceManager');

router.use(express.json());

router.post('/create', profileImage.single('icon'), ServiceManager.surgery.createSurgery);
router.get('/list', ServiceManager.surgery.getAllSurgeries);
router.get('/search/:word', ServiceManager.surgery.searchSurgeries);

module.exports = router;