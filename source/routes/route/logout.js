const express      = require('express');
const router       = express.Router();
const Service      = require('../../service/ServiceManager');

router.put('/', Service.logout.signoff);

module.exports = router;