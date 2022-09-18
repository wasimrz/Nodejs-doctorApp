const { Policy } = require("../../commons/models/mongo/mongodb");

function Repository () {}

Repository.prototype.createPolicy = async function (data) {
    const instance = await new Policy(data).save()
  return instance ? instance.toJSON() : null;
};

Repository.prototype.getPolicyData = async function (query) {
    const instance = await Policy.find(query).exec();
    return instance.length>0 ? instance : [];
  },


module.exports = new Repository();