const passport = require('passport');
const Response = require('../../commons/responses/EcomResponseManager');
const service = require('./LoginService');
const logger = require('../../commons/logger/logger');
const envproperties = require('../../properties.json');
const { User } = require('../../commons/models/mongo/mongodb');
const { refreshAccessToken } = require('../../commons/auth/OAuth2');
const { Context } = require('../../commons/context/dbContext');
const { ds, url, utility, crypto } = require('../../commons/util/UtilManager');
const { crypto: CryptoUtil } = require('../../commons/util/UtilManager');
const userRepository = require('../user/UserRepository');

const userService = require('../user/UserService');
const { send } = require('../../commons/externals/mailer/sms/sendSMS');
const encoder = require('urlencode');

function Controller() {}
function Time(mobileNumber) {
  setTimeout(async () => {
    obj = {
      to: mobileNumber,
      body: encoder.encode(envproperties.FIRST_LOGIN_TEMPLATE),
      template: '1007166155857833374'
    };
    obj2 = {
      to: mobileNumber,
      body: encoder.encode(envproperties.DOWNLOAD_ANDROID),
      template: '1007166155863929998'
    };
    obj3 = {
      to: mobileNumber,
      body: encoder.encode(envproperties.DOWNLOAD_IOS),
      template: '1007166155868510470'
    };
    data = await send(obj2);
    data = await send(obj3);
    data = await send(obj);
    console.log('data from sceduler', data);
  }, 1000 * 60 * 10);
}

Controller.prototype.refresh = async function(req, res, _next) {
  try {
    const userRes = await User.findOne({
      'token.refresh_token': req.headers.refreshtoken || req.headers.refreshkey
    }).exec();

    if (userRes) {
      const userObj = await userRes.toJSON();
      let userIP =
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      const token = await refreshAccessToken(userObj.token, userObj._id);
      await service.updateUser(userObj._id, token);

      return res.status(Response.success.Ok.code).json(
        Response.success.Ok.json({
          data: {
            userId: userObj._id,
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresAt: token.expires_at,
            login_channel: 'token-refresh',
            login_date: new Date(),
            userIP
          }
        })
      );
    } else {
      res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('User not found'));
    }
  } catch (e) {
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.success = async function(req, res, next) {
  try {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('userId');
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    const expiresAt = urlParams.get('expiresAt');
    const profileImage = urlParams.get('profileImageURL');

    const userObj = await service.getUserApplications(userId, {
      accessToken,
      refreshToken,
      expiresAt,
      profileImage
    });
    userObj.apps = userObj.apps.filter(
      x => '60929f9509dfffb02e84ef88' !== x.appTypeId
    );

    if (1 === userObj.apps.length) {
      res.redirect(userObj.apps[0].link);
    } else {
      res.locals.apps = userObj.apps;
      res.status(200);
      res.render('login-success');
    }
  } catch (e) {
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.error = async function(req, res, next) {
  res.render('login-error');
};

Controller.prototype.otp = async function(req, res, next) {
  try {
    const params = { ...req.body, ...req.query, ...req.params };

    if (!params.username) {
      return res
        .status(Response.error.Forbidden.code)
        .json(
          Response.error.Forbidden.json(
            'User not found, please register yourself...'
          )
        );
    } else {
      const userByMob = await service.findUserByContact(params.username);
      const userByEmail = await service.findUserByEmail(params.username);
      const user = userByMob || userByEmail;

      if (!user) {
        return res
          .status(Response.error.Forbidden.code)
          .json(
            Response.error.Forbidden.json(
              'User not found, please register yourself...'
            )
          );
      } else {
        // if (await service.isTooSoonToRetry(user)) {
        //   return res.status(Response.error.LimitExceeded.code).json(Response.error.LimitExceeded.json('Last OTP still alive! Please wait or reuse previous OTP...'));
        // } else {
        const otp = await service.generateLoginOTP();
        user.templateFor = 'ForgetPassword';
        const msg = await service.prepareOTPMessage(user, otp);
        let fdbck = null;
        try {
          fdbck = await service.sendOTP(msg);
        } catch (e) {
          logger.error(e);
        }

        const otpSent = fdbck.sentSMS || fdbck.sentEMAIL;

        if (otpSent) {
          await service.saveOTPtoProfile(user, msg);
        }

        return res.status(Response.success.Created.code).json(
          Response.success.Created.json({
            message: otpSent
              ? `OTP sent successfully!`
              : 'Oopsie!! Could not send OTP...',
            metadata: { feedback: fdbck }
          })
        );
      }
    }
  } catch (e) {
    logger.error(e);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.local = async function(req, res, next) {
  try {
    let userIP =
      req.headers.ip ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    passport.authenticate(
      'local',
      {
        successRedirect: '/',
        failureRedirect: '/login'
      },
      async function(err, user, info) {
        if (err) return next(err);

        if (!user)
          return res
            .status(Response.error.Forbidden.code)
            .json(
              Response.error.Forbidden.json(
                info.message || 'User not found, please register yourself...'
              )
            );

        try {
          console.log('142/*-*-*-*-*-*-*', user);
          const token = await service.generateAccessToken(user._id);
          console.log('======', token);
          if (user.isFirst == false) {
            let number = crypto.decrypt(user.mobile);
            Time(number);
            await service.updateUserById(user._id, true);
          }
          await service.updateUser(user._id, token);

          const data = {
            userId: user._id,
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresAt: token.expires_at,
            login_channel: 'local: password/otp',
            login_date: new Date(),
            userIP,
            profileImageURL:
              user?.social?.google?.picture ||
              user?.social?.facebook?.picture ||
              user?.social?.twitter?.picture
          };

          return res.status(Response.success.Ok.code).json(
            Response.success.Ok.json({
              data
            })
          );
        } catch (e) {
          logger.error(e.message);
          return res
            .status(Response.error.InvalidRequest.code)
            .json(Response.error.InvalidRequest.json());
        }
      }
    )(req, res, next);
  } catch (e) {
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.guest = async function(req, res, next) {
  try {
    let userIP =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    let user = await User.findOne({ _id: 'GUEST_USER' });
    const token = await service.generateAccessToken(user._id);
    await service.updateUser(user._id, token);

    const data = {
      userId: user._id,
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: token.expires_at,
      login_channel: 'guest: auto-' + userIP,
      login_date: new Date(),
      userIP
    };

    try {
      const {
        ResponseUnlinkedAnalysis
      } = require('../../middleware/statistics');
      ResponseUnlinkedAnalysis(url.getReducedRequest(req), data);
    } catch (e) {
      logger.error(e.message);
    }

    return res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        data
      })
    );
  } catch (e) {
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.resetPassword = async function(req, res, next) {
  try {
    let { username, otp, password, resource } = req.body;
    resource = 'pax';
    const user = await service.simulateLogin(username, otp, resource);

    if (!user.userId) {
      res
        .status(Response.error.NotFound.code)
        .json(Response.error.NotFound.json('No user exists or Invalid OTP'));
      return;
    }

    await service.updatePassword(user.userId, password);

    res.status(Response.success.Ok.code).json(
      Response.success.Ok.json({
        message: 'Pasword updated successfully!'
      })
    );
  } catch (e) {
    const errMsg = ((e.response || {}).data || {}).message || e.message;
    logger.error(e.message);
    res
      .status(Response.error.Forbidden.code)
      .json(Response.error.Forbidden.json(errMsg));
  }
};

Controller.prototype.facebookCallback = async function(req, res, next) {
  try {
    passport.authenticate(
      'facebook',
      {
        successRedirect: '/',
        failureRedirect: '/login'
      },
      async function(err, user, info) {
        if (err) return next(err);

        if (!user) return res.redirect(`/login/error`);

        try {
          const token = await service.generateAccessToken(user._id);
          await service.updateUser(user._id, token);

          const data = {
            userId: user._id,
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresAt: token.expires_at,
            login_channel: 'facebook',
            login_date: new Date(),
            profileImageURL: user?.social?.facebook?.picture
          };

          try {
            const {
              ResponseUnlinkedAnalysis
            } = require('../../middleware/statistics');
            ResponseUnlinkedAnalysis(url.getReducedRequest(req), data);
          } catch (e) {
            logger.error(e.message);
          }

          return res.redirect(
            `/login/success?profileImageURL=${url.encodeURI(
              data.profileImageURL
            )}&userId=${user._id}&accessToken=${
              token.access_token
            }&refreshToken=${token.refresh_token}&expiresAt=${token.expires_at}`
          );
        } catch (e) {
          return res
            .status(Response.error.InvalidRequest.code)
            .json(Response.error.InvalidRequest.json());
        }
      }
    )(req, res, next);
  } catch (e) {
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.googleCallback = async function(req, res, next) {
  try {
    passport.authenticate(
      'google',
      {
        successRedirect: '/',
        failureRedirect: '/login'
      },
      async function(err, user, info) {
        if (err) return next(err);

        if (!user) return res.redirect(`/login/error`);

        try {
          const token = await service.generateAccessToken(user._id);
          await service.updateUser(user._id, token);

          const data = {
            userId: user._id,
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresAt: token.expires_at,
            login_channel: 'google',
            login_date: new Date(),
            profileImageURL: user?.social?.google?.picture
          };

          try {
            const {
              ResponseUnlinkedAnalysis
            } = require('../../middleware/statistics');
            ResponseUnlinkedAnalysis(url.getReducedRequest(req), data);
          } catch (e) {
            logger.error(e.message);
          }

          return res.redirect(
            `/login/success?profileImageURL=${url.encodeURI(
              data.profileImageURL
            )}&userId=${user._id}&accessToken=${
              token.access_token
            }&refreshToken=${token.refresh_token}&expiresAt=${token.expires_at}`
          );
        } catch (e) {
          return res
            .status(Response.error.InvalidRequest.code)
            .json(Response.error.InvalidRequest.json());
        }
      }
    )(req, res, next);
  } catch (e) {
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.twitterCallback = async function(req, res, next) {
  try {
    passport.authenticate(
      'twitter',
      {
        successRedirect: '/',
        failureRedirect: '/login'
      },
      async function(err, user, info) {
        if (err) return next(err);

        if (!user) return res.redirect(`/login/error`);

        try {
          const token = await service.generateAccessToken(user._id);
          await service.updateUser(user._id, token);

          const data = {
            userId: user._id,
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresAt: token.expires_at,
            login_channel: 'twitter',
            login_date: new Date(),
            profileImageURL: user?.social?.twitter?.picture
          };

          try {
            const {
              ResponseUnlinkedAnalysis
            } = require('../../middleware/statistics');
            ResponseUnlinkedAnalysis(url.getReducedRequest(req), data);
          } catch (e) {
            logger.error(e.message);
          }

          return res.redirect(
            `/login/success?profileImageURL=${url.encodeURI(
              data.profileImageURL
            )}&userId=${user._id}&accessToken=${
              token.access_token
            }&refreshToken=${token.refresh_token}&expiresAt=${token.expires_at}`
          );
        } catch (e) {
          return res
            .status(Response.error.InvalidRequest.code)
            .json(Response.error.InvalidRequest.json());
        }
      }
    )(req, res, next);
  } catch (e) {
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.generateOtp = async function(req, res, next) {
  try {
    console.log('i am here to check', req.body);
    const params = { ...req.body, ...req.query, ...req.params };
    // let PasswordDecrypt

    if (utility.isValidEmail(params.email) == false) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(Response.error.Forbidden.json('Please enter a valid email ...'));
    }

    if (utility.isValidMobileNumber(params.contact) == false) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.Forbidden.json(
            'Please enter a valid mobile number ...'
          )
        );
    }
    const user = await service.findUser(params.email, params.contact);
    //same for otp creation user exist or not
    if ( user != undefined && params.email != CryptoUtil.decrypt(user.email) && user != undefined ) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.Forbidden.json(
            'Please enter a correct combination your email is incorrect ...'
          )
        );
    } else if ( user != undefined && params.contact != CryptoUtil.decrypt(user.mobile) ) {
      return res
        .status(Response.error.InvalidRequest.code)
        .json(
          Response.error.Forbidden.json(
            'Please enter a correct combination your mobile number is incorrect ...'
          )
        );
    } else {
      if (params.password == '5050') {
        if (!user) {
          let userId = await service.regUser(req.body);
          res.status(Response.success.Ok.code).json(
            Response.success.Ok.json({
              data: { userId: userId, isCreated: false },
              message: 'OTP generated for verification'
            })
          );
        } else {
          console.log(
            '======>',
            CryptoUtil.hashCompare(params.password, user.password),
            user.password,
            params.password
          );
          if (CryptoUtil.hashCompare(params.password, user.password) == false) {
            return res
              .status(Response.error.Forbidden.code)
              .json(Response.error.Forbidden.json('Invalid Password...'));
          }
          // if (await service.isTooSoonToRetry(user)) {
          //   return res.status(Response.error.LimitExceeded.code).json(Response.error.LimitExceeded.json('Last OTP still alive! Please wait or reuse previous OTP...'));
          // } else {

          const otp = await service.generateLoginOTP();
          user.templateFor = 'Login';
          const msg = await service.prepareOTPMessage(user, otp);
          // const msg = {
          //   mobile: user.mobile ? crypto.decrypt(user.mobile) : null,
          //   email: user.email ? crypto.decrypt(user.email) : null,
          //   subject: process.OTP_SUB,
          //   var1: otp,
          //   var2: process.env.LOCAL_OTP_VALIDITY
          // };
          let fdbck = null;
          try {
            fdbck = await service.sendOTP(msg);
          } catch (e) {
            logger.error(e);
          }
          const otpSent = fdbck.sentSMS || fdbck.sentEMAIL;
          console.log('otpSentotpSentotpSentotpSent', otpSent);
          if (otpSent) {
            await service.saveOTPtoProfile(user, msg);
          }
          return res.status(Response.success.Created.code).json(
            Response.success.Created.json({
              message: otpSent
                ? `OTP sent successfully!`
                : 'Oopsie!! Could not send OTP...',
              metadata: {
                feedback: fdbck,
                isAdmin: user.isAdmin == undefined ? false : user.isAdmin
              }
            })
          );
          // }
        }
      } else {
        //if password is not 5050
        if (!user) {
          return res
            .status(Response.error.Forbidden.code)
            .json(
              Response.error.Forbidden.json(
                'User not found, please register yourself...'
              )
            );
        }
        if (CryptoUtil.hashCompare(params.password, user.password) == false) {
          return res
            .status(Response.error.Forbidden.code)
            .json(Response.error.Forbidden.json('Invalid Password...'));
        }
        // if (await service.isTooSoonToRetry(user)) {
        //   return res.status(Response.error.LimitExceeded.code).json(Response.error.LimitExceeded.json('Last OTP still alive! Please wait or reuse previous OTP...'));
        // } else {
        const otp = await service.generateLoginOTP();
        user.templateFor = 'Login';
        const msg = await service.prepareOTPMessage(user, otp);
        let fdbck = null;
        try {
          fdbck = await service.sendOTP(msg);
        } catch (e) {
          logger.error(e);
        }
        const otpSent = fdbck.sentSMS || fdbck.sentEMAIL;
        if (otpSent) {
          await service.saveOTPtoProfile(user, msg);
        }
        return res.status(Response.success.Created.code).json(
          Response.success.Created.json({
            message: otpSent
              ? `OTP sent successfully!`
              : 'Oopsie!! Could not send OTP...',
            metadata: {
              feedback: fdbck,
              isAdmin: user.isAdmin == undefined ? false : user.isAdmin
            }
          })
        );
        // }
      }
    }
  } catch (error) {
    console.log('hjhjhjhjhjh', error);
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};
module.exports = new Controller();


