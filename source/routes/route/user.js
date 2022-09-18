const express = require('express');
const router = express.Router();
const passport = require('../../commons/auth/Passport');
const ServiceManager = require('../../service/ServiceManager');

router.use(express.json());

router.get('/info', ServiceManager.user.info);
router.post('/delete', ServiceManager.user.delete);
router.post('/register', ServiceManager.user.registerPseudoUser);
router.post('/validateToReg', ServiceManager.user.validateAndRegUser);
router.get('/permissions/:appType', ServiceManager.user.accessPermissions);
router.get('/permissions/v2/:appType', ServiceManager.user.accessPermissionsV2);
router.post('/consultation/create', ServiceManager.consultation.add);
router.get('/consultation/list', ServiceManager.consultation.list);
router.patch('/consultation/edit', ServiceManager.consultation.edit);
router.patch('/profile-edit', ServiceManager.user.edit);

router.delete('/deleteAccount', ServiceManager.user.deleteUserAccount);

module.exports = router;
