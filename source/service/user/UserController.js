const logger   = require('../../commons/logger/logger');
const Response = require('../../commons/responses/EcomResponseManager');
const {
  Context: DBContext
} = require('../../commons/context/dbContext');
const {
  ds,
  url,
} = require('../../commons/util/UtilManager');
const {
  crypto
} = require('../../commons/util/UtilManager');
const service = require('./UserService');
const { User } = require('../../commons/models/mongo/mongodb');
const { Account } = require('../../commons/models/mongo/mongodb');
const { profile } = require('winston');
const { S3 } = require('../../commons/util/UtilManager');

function Controller() { }

function mapAssetDetailsById(obj, assetDetails, permission) {
  obj.assetId && (obj = { ...obj, ...assetDetails[obj.assetId] });
  obj.permissionId && (obj = { ...obj, ...permission[obj.permissionId] });

  if (obj.subAssets) {
    obj.subAssets = obj.subAssets.map(x => mapAssetDetailsById(x, assetDetails, permission));
  }
  if (obj.childAssets) {
    obj.childAssets = obj.childAssets.map(x => mapAssetDetailsById(x, assetDetails, permission));
  }

  return obj;
}

function flattenAssetMap(obj, acc = []) {
  if (obj.childAssets) {
    obj.childAssets = obj.childAssets.map(x => flattenAssetMap(x, acc));
  }
  if (obj.subAssets) {
    obj.subAssets = obj.subAssets.map(x => flattenAssetMap(x, acc));
  }

  if (obj._id) {
    acc.push({
      assetId: obj._id,
      assetName: obj.assetName,
      apiEndPoint: obj.apiEndPoint,
    });
  }

  return acc;
}

Controller.prototype.delete = async function (req, res, _next) {
  const accountId = req.user._id;
  const {
    username,
    otp,
    resource
  } = req.body;

  const user = await service.simulateLogin(username, otp, resource);

  if (!(user && user.userId)) {
    return res.status(Response.error.NotFound.code).json(Response.error.NotFound.json('No user exists or Invalid OTP'));
  }

  if (accountId !== user.userId) {
    return res.status(Response.error.NotFound.code).json(Response.error.NotFound.json(`User reference mismatch, are you trying to delete someone else's account ? Bad Manners!`));
  }

  await service.removeUser(accountId);

  try {
    const { ResponseUnlinkedAnalysis } = require('../../middleware/statistics');
    ResponseUnlinkedAnalysis(url.getReducedRequest(req), { ...req.body, accountId, user: req.user });
  } catch (e) { logger.error(e.message) }

  return res.status(Response.success.Ok.code).json(Response.success.Ok.json({
    message: 'User record deleted!',
  }));
}

Controller.prototype.info = async function (req, res, next) {
  try {
    const email  = crypto.decrypt(req.user.email);
    const mobile = crypto.decrypt(req.user.mobile);
    const data   = {
      userId           : req.user._id,
      email            : url.encodeURI(email),
      mobile           : url.encodeURI(mobile),
      emailMasked      : crypto.mask(email),
      mobileMasked     : crypto.mask(mobile),
      firstName        : crypto.decrypt(req.user.firstName),
      lastName         : crypto.decrypt(req.user.lastName),
      fullName         : crypto.decrypt(req.user.fullName),
      role             : req.user.role,
      roleId           : req.user.userRoleId,
      concessionareCode: req.user.concessionareCode,
      stores           : req.user.concessionaireStores,
      devices          : req.user.devices,
      registeredOn     : req.user.createdAt,
      nationality      : req.user.nationality,
      country          : req.user.country,
      city             : req.user.city,
    };

    try {
      const { ResponseUnlinkedAnalysis } = require('../../middleware/statistics');
      ResponseUnlinkedAnalysis(url.getReducedRequest(req), data);
    } catch (e) { logger.error(e.message) }

    return res.status(Response.success.Ok.code).json(Response.success.Ok.json({
      data,
    }));
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
}

Controller.prototype.accessPermissions = async function (req, res, next) {
  try {
    const appPrefix = '/' + req.params.appType;
    const userObj = req.user;

    if (req.params.appType && userObj) {
      const { appType, assetDetail, permission, roleAssetMap, assetType } = await DBContext.get('user_permissions');

      const targetApp = Object.values(appType).find(x => x.appPrefix.includes(appPrefix));

      if (!targetApp) {
        // application not exists in db
        res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json(`Application you're trying to access doesn't exist.`));
        return;
      }
      if (!userObj.apps) {
        // application not exists in db
        res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json(`You don't have access to this app.`));
        return;
      }

      // locate app in user object to identify app permission exists
      const userApp = userObj.apps.find(x => x.appTypeId === targetApp._id);

      if (!userApp) {
        // application not bound to user, reject request
        res.status(Response.error.Forbidden.code).json(Response.error.Forbidden.json(`You do not have access to this application.`));
        return;
      }

      // filter out backend assets out of roleAssetPermMap data by level1 of roleAssets and frontendAssets._id
      const frontendAssetType = Object.values(assetType).find(x => x.assetType.startsWith('Frontend'));
      const frontendAssets    = JSON.parse(JSON.stringify(Object.values(assetDetail).filter(x => x.assetTypeId === frontendAssetType._id && x.appTypeId === targetApp._id)));

      const frontendAssetRed = [];
      frontendAssets.forEach(x => flattenAssetMap(x, frontendAssetRed));

      const frontendAssetMap = frontendAssetRed.reduce((acc, curr) => [...acc, curr], []);
      const flatAssetMap     = JSON.parse(JSON.stringify(ds.transformArrayToObjectByKey(frontendAssetMap, 'assetId')));
      const flatPermMap      = JSON.parse(JSON.stringify(ds.transformArrayToObjectByKey(
        Object.values(permission).map(x => {
          return {
            pk: x._id,
            permissionId: x.permissionId,
            permissionname: x.permissionName
          }
        }),
        'pk'
      )));

      const userRoleId = userApp.userRoleId;
      const roleAssets = Object.values(roleAssetMap).filter(x => x.roleId === userRoleId);
      const feRolePKs = roleAssets
        .reduce((acc, curr) => [...acc, { assetId: curr.assets[0] ? curr.assets[0].assetId : '', fk: curr._id }], [])
        .filter(x => Object.keys(flatAssetMap).includes(x.assetId))
        .reduce((acc, curr) => [...acc, curr.fk], []);

      // default role based assets recorded [now map asset and permission info to this object recursively]
      const defaultAssets = roleAssets
        .filter(x => feRolePKs.includes(x._id) && 'Y' === x.isActive)
        .reduce((acc, curr) => [...acc, ...curr.assets], []);

      const defaultAssetInfo = defaultAssets.map(
        x => mapAssetDetailsById(x, flatAssetMap, flatPermMap)
      );
      const overrideAssetInfo = userApp.assets.map(
        x => mapAssetDetailsById(x, flatAssetMap, flatPermMap)
      );

      res.status(Response.success.Ok.code).json(Response.success.Ok.json({
        data: {
          defaults: defaultAssetInfo,
          overrides: overrideAssetInfo,
        }
      }));
    } else {
      res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json('AppType Missing or Unknown User'));
    }
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
}

Controller.prototype.accessPermissionsV2 = async function (req, res, next) {
  try {
    const appPrefix = '/' + req.params.appType;
    const userObj = req.user;

    if (req.params.appType && userObj) {
      // cache master data
      const { appType, assetDetail, permission, roleAssetMap } = await DBContext.get('user_permissions');

      // identify target application based on app prefix
      const targetApp = Object.values(appType).find(x => x.appPrefix.includes(appPrefix));

      if (!targetApp) {
        // application not exists in db
        res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json(`Application you're trying to access doesn't exist.`));
        return;
      }
      if (!userObj.apps) {
        // application not exists in db
        res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json(`You don't have access to this app.`));
        return;
      }

      // locate app in user object to identify app permission exists
      const userApp = userObj.apps.find(x => x.appTypeId === targetApp._id);

      if (!userApp) {
        // application not bound to user, reject request
        res.status(Response.error.Forbidden.code).json(Response.error.Forbidden.json(`You do not have access to this application.`));
        return;
      }

      // pull role id for the user based on app
      const userRoleId = userApp.userRoleId;

      // pull raw data default assets for the role
      const roleAssets = Object.values(roleAssetMap).filter(x => x.roleId === userRoleId);

      // trim raw data to identify pairs of assetId-permissionId for default assets
      const defaultAssets = roleAssets.reduce((acc, curr) => [...acc, ...curr.assets], [])
        .filter(x => 'Y' === x.isActive)
        .map(x => { return { assetId: x.assetId, permissionId: x.permissionId, consumer: assetDetail[x.assetId].consumer } })
        .filter(x => assetDetail[x.assetId].appTypeId === targetApp._id);

      // organize asset overrides                        
      const assetOverrides = ds.transformArrayToObjectByKey(userApp.backEndAssets, 'assetId');

      // apply permission overrides
      defaultAssets.forEach(x => assetOverrides[x.assetId] && (x.permissionId = assetOverrides[x.assetId].permissionId));

      const permissionsMap = {};
      defaultAssets.forEach(x => {
        x.consumer && x.consumer.map(y => {
          void 0 === permissionsMap[y] && (permissionsMap[y] = 0);

          permissionsMap[y] = Math.max(permissionsMap[y], parseInt(permission[x.permissionId].permissionId));
        });
      });

      const permissionTranslation = { 0: 'none', 1: 'view', 2: 'edit', 3: 'create', 4: 'delete' };
      const permissionsConfig = [];
      for (var resource in permissionsMap) {
        permissionsConfig.push(`${resource}=${permissionTranslation[permissionsMap[resource]]}`);
      }

      res.status(Response.success.Ok.code).json(Response.success.Ok.json({
        data: permissionsConfig
      }));

    } else {
      res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json('AppType Missing or Unknown User'));
    }
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
}

Controller.prototype.registerPseudoUser = async function (req, res, next) {

  try {
    const pseudoUserId = await service.regPseudoUser(req);
    // console.log()
    if (!pseudoUserId) {
      res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json('User already exists'));
    } else {
      res.status(Response.success.Ok.code).json(Response.success.Ok.json({
        data: pseudoUserId,
        message: 'OTP generated for verification'
      }));
    }
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
}

Controller.prototype.validateAndRegUser = async function (req, res, next) {
  try {
    const data = await service.validateAndReg(req);
    if (data) {
      res.status(Response.success.Ok.code).json(Response.success.Ok.json({
        message: 'Validation successful, User is registered successfully',
        data: data,
      }));
    } else {
      res.status(Response.error.InvalidRequest.code).json(Response.error.InvalidRequest.json(
        'Validation failed due to otp expiry or invalid otp'
      ));
    };
  } catch (e) {
    logger.error(e.message);
    res.status(Response.error.InternalError.code).json(Response.error.InternalError.json());
  }
}

Controller.prototype.registerPseudoUserV2 = async function (req, res, next) {
  try {
    const pseudoUserId = await service.regPseudoUserV2(req);
    // console.log()
    if (!pseudoUserId) {
      res
        .status(Response.error.InvalidRequest.code)
        .json(Response.error.InvalidRequest.json('User already exists'));
    } else {
      res.status(Response.success.Ok.code).json(
        Response.success.Ok.json({
          data: pseudoUserId,
          message: 'OTP generated for verification',
        })
      );
    }
  } catch (e) {
    logger.error(e.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};

Controller.prototype.edit = async (req, res) => {
  try {
    let {
      userId,
      name,
      email,
      mobile,
      city,
      gender,
      dob,
      password
    } = req.body;
    var file = await S3.doUpload(req.files.image, 'profile');
    
    let userDetails = await service.findById(userId);
    if (!userDetails) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('userId not exist.'));
    }

    let data = {
      userId,
      name: userDetails.name,
      email: userDetails.email,
      mobile: userDetails.mobile,
      city: userDetails.city,
      gender: userDetails.gender,
      dob: userDetails.dob,
      password: userDetails.password,
      profile: file
    };

    let isUpdated = await service.updateProfile(data);
    if (!isUpdated) {
      return res
        .status(Response.error.Forbidden.code)
        .json(Response.error.Forbidden.json('Unable to update.'));
    }
    return res
      .status(Response.success.Ok.code)
      .json(Response.success.Ok.json({ data }));
  } catch (error) {
    console.log(error);
    logger.error(error.message);
    res
      .status(Response.error.InternalError.code)
      .json(Response.error.InternalError.json());
  }
};


Controller.prototype.deleteUserAccount = async function (req, res, _next) {
  const accountId = req.user._id;
const userData = await User.find({'_id': accountId}).exec();
const accountData = await Account.find({'email': userData[0].email}).exec();
  const user = userData;
  // await service.simulateLogin(username, otp, resource);

  if (!(user && user.userId)) {
    return res.status(Response.error.NotFound.code).json(Response.error.NotFound.json('No user exists or Invalid OTP'));
  }

  if (accountId !== user.userId) {
    return res.status(Response.error.NotFound.code).json(Response.error.NotFound.json(`User reference mismatch, are you trying to delete someone else's account ? Bad Manners!`));
  }

  await service.removeUserAccount(accountId);

  try {
    const { ResponseUnlinkedAnalysis } = require('../../middleware/statistics');
    ResponseUnlinkedAnalysis(url.getReducedRequest(req), { ...req.body, accountId, user: req.user });
  } catch (e) { logger.error(e.message) }

  return res.status(Response.success.Ok.code).json(Response.success.Ok.json({
    message: 'User record deleted!',
  }));
}

module.exports = new Controller();