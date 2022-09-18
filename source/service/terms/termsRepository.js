const { Terms,Account } = require("../../commons/models/mongo/mongodb");

function Repository () {}

Repository.prototype.createTerms = async function (data) {
  // console.log(data)
    const instance = await new Terms(data).save()
  return instance ? instance.toJSON() : null;
};

Repository.prototype.getTermsData = async function (query) {
    const instance = await Terms.find(query).exec();
    return instance.length>0 ? instance : [];
  },

Repository.prototype.updateAccoutTerms = async function(data) {
    const isUpdated = await Account.updateOne(
      { _id: data.userId },
      { ...data }
    );
    return isUpdated.ok ? true : false;
};

module.exports = new Repository();