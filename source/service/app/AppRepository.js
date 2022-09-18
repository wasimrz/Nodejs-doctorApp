const { AppReview } = require("../../commons/models/mongo/mongodb");

/********************* APPREVIEW'S REPO ***********************/

function Repository() {}

//used to create new documents
Repository.prototype.createDocument = async function (data, modelName) {  
    modelName = AppReview;
    const instance = await modelName.create(data);
    return instance ? instance.toJSON() : null;
};

//Used to get all documents
Repository.prototype.getAllDocuments = async function (modelName) {
    modelName = AppReview;
    const instance = await modelName.find({});
    return instance.length ? instance : null;
};

//Used to get collection by Id
Repository.prototype.getById = async function (id, modelName) {
    modelName = AppReview;
    const instance = await modelName.findOne({ _id: id });
    return instance ? instance.toJSON() : null;
};

//used to findOne and update the document
Repository.prototype.getByIDAndUpdate = async function(query, updation, modelName){
    modelName = AppReview;
    const instance = await modelName.findOneAndUpdate(query, updation, { new: true } );
    return instance ? instance.toJSON() : null;
}

//used to check a document exists or not
Repository.prototype.checkDocExists = async function(query){
    modelName = AppReview;
    const instance = await modelName.countDocuments(query);
    return instance;
}

//used to get the aggregation results
Repository.prototype.getAggregation = async function(query){
    modelName = AppReview;
    const instance = await modelName.aggregate(query);
    return instance;
}

module.exports = new Repository();