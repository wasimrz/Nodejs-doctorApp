const {
  User,
  Account,
  Invitations
} = require('../../commons/models/mongo/mongodb');
const mongoose = require('mongoose');

function Repository() {}

Repository.prototype.deleteAccount = async function(_id) {
  await User.remove({ _id });
  await Account.remove({ _id });
  return true;
};

Repository.prototype.createUser = async function(userObj) {
  let user = await new User(userObj).save();
  let account = await new Account(userObj).save();
  return user._id;
};

Repository.prototype.getUniqueCode = function() {
  let code = randomString(
    6,
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  );
  return code;
};

Repository.prototype.addDetails = function(data) {
  data._id = new mongoose.Types.ObjectId().toHexString();
  return Invitations.create(data);
};

Repository.prototype.invitationsList = async function() {
  return await Invitations.find({});
};

function randomString(length, chars) {
  let result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

Repository.prototype.getUser = async function(query) {
  const model = User;
  let user = model.find(query);

  return user ? user : null;
}
 



module.exports = new Repository();
