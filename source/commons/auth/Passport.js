require('dotenv');
const logger           = require('../logger/logger');
const mongoose         = require('mongoose');
const passport         = require('passport');
const LocalStrategy    = require('passport-local').Strategy;
const GoogleStrategy   = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy  = require('passport-twitter').Strategy;
const { DefaultApps }  = require('../config/ConfigManager');
const { crypto, datetime }  = require('../util/UtilManager');
const {
  Account,
  User 
} = require('../models/mongo/mongodb');

const isExpired = function(expiryTime) {
  if(!expiryTime) return true;

  const diff = datetime.dateDifferenceBetween(expiryTime, datetime.now(), 'seconds');
  return diff < 0;
}

const createNewUserBySocialAccount = async function(emailENC, social, account) {
  const newUserId  = (new mongoose.Types.ObjectId().toHexString());
  const defaultApp = DefaultApps.apps;

  await new User({
    _id: newUserId,
    social,
    createdAt: (new Date()),
    updatedAt: (new Date()),
    email: emailENC,
    apps: defaultApp,
    login: [],
  }).save();

  await new Account({ _id: newUserId, ...account }).save();
}

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'otp'
},
  async function (username, password, done) {
    const usernameENC = crypto.encrypt(username);

    const user = (await User.findOne({ email: usernameENC }) || await User.findOne({ mobile: usernameENC }));

    if (!user) return done(null, false, { message: 'User does not exist.' });

    try {
      if (
        !(crypto.hashCompare(password, user.password) || crypto.hashCompare(password, user.passwordOtp))
      ) return done(null, false, { message: 'Incorrect OTP' });
    } catch (e) { logger.error(e.message) }
    
    try {
      if (
        crypto.hashCompare(password, user.passwordOtp) && isExpired(user.otpExpiry)
      ) return done(null, false, { message: 'OTP Expired.' });
    } catch (e) { logger.error(e.message) }

    return done(null, user.toJSON());
  }
));

// passport.use(new GoogleStrategy({
//   clientID      : process.env.GGL_CLIENT_ID,
//   clientSecret  : process.env.GGL_SECRET,
//   callbackURL   : process.env.GGL_CALLBACK_URL,
//   accessType    : process.env.GGL_ACCESS_TYPE,
//   userProfileURL: process.env.GGL_USER_INFO_URL,
// }, async function (accessToken, refreshToken, profile, done) {
//   try {
//     const emailENC = crypto.encrypt(profile._json.email || `${profile.id}@google.com`);
//     let user       = await User.findOne({ email: emailENC });

//     if (!user) {
//       await createNewUserBySocialAccount(emailENC, {
//         google: {
//           id: profile._json.sub,
//           picture: profile._json.picture,
//           email: emailENC,
//           email_verified: profile._json.email_verified,
//           locale: profile._json.locale,
//           access_token: accessToken,
//           refresh_token: refreshToken
//         }
//       }, {
//         firstName: crypto.encrypt(profile._json.given_name),
//         fullName: crypto.encrypt(profile._json.name),
//         lastName: crypto.encrypt(profile._json.family_name),
//         email: emailENC,
//         createdAt: (new Date()),
//       });

//       user = await User.findOne({ email: emailENC });

//     } else {
//       const tempUserRef = user.toJSON();
      
//       if(!tempUserRef.social[profile.provider]) {
//         await User.updateOne({ _id: user._id }, { $set: { [`social.${profile.provider}`]: {
//           id: profile._json.sub,
//           picture: profile._json.picture,
//           email: emailENC,
//           email_verified: profile._json.email_verified,
//           locale: profile._json.locale,
//           access_token: accessToken,
//           refresh_token: refreshToken
//         }}});
//       }
//     }

//     return done(null, user.toJSON());

//   } catch (e) {
//     return done(null, null);
//   }
// }));

// passport.use(new FacebookStrategy({
//   clientID: process.env.FB_CLIENT_ID,
//   clientSecret: process.env.FB_SECRET,
//   callbackURL: process.env.FB_CALLBACK_URL,
//   profileFields: ['id', 'email', 'displayName', 'photos']
// }, async function(accessToken, refreshToken, profile, done) {
//   try {
//     const emailENC = crypto.encrypt(profile._json.email || `${profile._json.id}@facebook.com`);
//     let user       = await User.findOne({ email: emailENC });

//     if (!user) {
//       await createNewUserBySocialAccount(emailENC, {
//         facebook: {
//           id: profile._json.id,
//           picture: profile._json.picture.data.url,
//           email: emailENC,
//           email_verified: profile._json.email ? true : false,
//           locale: profile._json.locale || 'en',
//           access_token: accessToken,
//           refresh_token: refreshToken,
//         }
//       }, {
//         firstName: crypto.encrypt(profile.name.givenName),
//         fullName: crypto.encrypt(profile._json.name),
//         lastName: crypto.encrypt(profile.name.familyName),
//         email: emailENC,
//         createdAt: (new Date()),
//       });

//       user = await User.findOne({ email: emailENC });

//     } else {
//       const tempUserRef = user.toJSON();
      
//       if(!tempUserRef.social[profile.provider]) {
//         await User.updateOne({ _id: user._id }, { $set: { [`social.${profile.provider}`]: {
//           id: profile._json.id,
//           picture: profile._json.picture.data.url,
//           email: emailENC,
//           email_verified: profile._json.email ? true : false,
//           locale: profile._json.locale || 'en',
//           access_token: accessToken,
//           refresh_token: refreshToken,
//         }}});
//       }
//     }

//     return done(null, user.toJSON());

//   } catch (e) {
//     return done(null, null);
//   }
// }));

// passport.use(new TwitterStrategy({
//   consumerKey: process.env.TTR_CLIENT_ID,
//   consumerSecret: process.env.TTR_CLIENT_SECRET,
//   callbackURL: process.env.TTR_CALLBACK_URL,
//   includeEmail: true,
// }, async function(accessToken, refreshToken, profile, done) {
//   try {
//     const emailENC = crypto.encrypt(profile._json.email || `${profile._json.id}@twitter.com`);
//     let user       = await User.findOne({ email: emailENC });

//     if (!user) {
//       await createNewUserBySocialAccount(emailENC, {
//         twitter: {
//           id: profile._json.id,
//           picture: profile._json.profile_image_url_https,
//           email: emailENC,
//           email_verified: profile._json.email ? true : false,
//           locale: profile._json.locale || 'en',
//           access_token: accessToken,
//           refresh_token: refreshToken,
//         }
//       }, {
//         firstName: crypto.encrypt(profile._json.givenName),
//         fullName: crypto.encrypt(profile._json.name),
//         lastName: crypto.encrypt(profile._json.familyName),
//         email: emailENC,
//         createdAt: (new Date()),
//       });

//       user = await User.findOne({ email: emailENC });

//     } else {
//       const tempUserRef = user.toJSON();

//       if(!tempUserRef.social[profile.provider]) {
//         await User.updateOne({ _id: user._id }, { $set: { [`social.${profile.provider}`]: {
//           id: profile._json.id,
//           picture: profile._json.profile_image_url_https,
//           email: emailENC,
//           email_verified: profile._json.email ? true : false,
//           locale: profile._json.locale || 'en',
//           access_token: accessToken,
//           refresh_token: refreshToken,
//         }}});
//       }
//     }

//     return done(null, user.toJSON());

//   } catch (e) {
//     return done(null, null);
//   }
// }));

module.exports = passport;