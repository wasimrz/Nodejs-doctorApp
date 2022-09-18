const express      = require('express');
const router       = express.Router();

const ServiceManager      = require('../../service/ServiceManager');

router.use(express.json());

router.get('/list', ServiceManager.test.listTest);
router.post('/create', ServiceManager.test.create);

module.exports = router;