const express      = require('express');
const router       = express.Router();
const passport     = require('../../commons/auth/Passport');
const Service      = require('../../service/ServiceManager');

router.use(express.json());

router.post('/create',Service.problem.problem);
router.get('/list',Service.problem.list)

module.exports = router;