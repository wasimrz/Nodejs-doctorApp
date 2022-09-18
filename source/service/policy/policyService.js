require("dotenv");
const repository = require("./policyRepository");

function Service() {}

Service.prototype.getAllPolicy = async function (query) {
  return repository.getPolicyData(query);
};

Service.prototype.addPolicyData = async function (req) {
  console.log(req) 
  let obj={
        _id:new mongoose.Types.ObjectId().toHexString(),
        updatedAt:new Date(),
        createdAt: new Date(),
        policyName:req.policyName,
        description:req.description,
        userId:req.userId,
         image:req.image
      }
  return repository.createPolicy(obj);
};

module.exports = new Service();