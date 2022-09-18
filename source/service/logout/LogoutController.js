const Response = require('../../commons/responses/EcomResponseManager');
const logger   = require('../../commons/logger/logger');
const {
  revokeAccessToken
} = require('../../commons/auth/OAuth2');
const {
  User
} = require('../../commons/models/mongo/mongodb');
const {
  url
} = require('../../commons/util/UtilManager');

function Controller () {}

Controller.prototype.signoff = async function (req, res, next) {
  try {
    const userRes = (await User.findOne({ "token.refresh_token": req.headers.refreshtoken || req.headers.refreshkey }) 
                  || await User.findOne({ "token.access_token": req.headers.authorization || req.headers.accesskey }));

    if (userRes) {
      const userObj = userRes.toJSON();
      
      await User.updateOne({
        _id: userObj._id
      }, {
        $push: { login: {
          login_date: new Date(),
          login_channel: 'logout',
        }},
        token: {}
      });

      try {
        const { ResponseUnlinkedAnalysis } = require('../../middleware/statistics');
        ResponseUnlinkedAnalysis(url.getReducedRequest(req), userObj);
      } catch (e) { logger.error(e.message) }

      return res.status(Response.success.Ok.code).json(await revokeAccessToken(userObj.token));
    } else {
      res.status(Response.error.Forbidden.code).json(Response.error.Forbidden.json('User not found'));
    }
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
}

module.exports = new Controller();