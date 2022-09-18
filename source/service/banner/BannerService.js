require("dotenv");
const repository = require("./BannerRepository");

function Service() {}

Service.prototype.getAllBanners = async function () {
  return repository.getAll("Banner");
};

Service.prototype.addDetails = async function (data, modelName) {
  return repository.createDocument(data, modelName);
};

module.exports = new Service();
