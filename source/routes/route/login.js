const express      = require('express');
const router       = express.Router();
const passport     = require('../../commons/auth/Passport');
const Service      = require('../../service/ServiceManager');

router.use(express.json());

router.put('/refresh', Service.login.refresh);
router.get('/success', Service.login.success);
router.get('/error', Service.login.error);

router.patch('/otp', Service.login.otp);
router.patch('/local', Service.login.local);
router.get('/guest', Service.login.guest);
router.put('/generateOtp', Service.login.generateOtp);

router.put('/reset/password', Service.login.resetPassword);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', Service.login.facebookCallback);

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', Service.login.googleCallback);

router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', Service.login.twitterCallback);

module.exports = router;