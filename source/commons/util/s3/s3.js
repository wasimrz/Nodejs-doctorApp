const AWS = require('aws-sdk');
var path = require('path');
var uniqid = require('uniqid');
var mime = require('mime-types');
const s3Client = new AWS.S3({
    accessKeyId: process.env.S3KEY,
    secretAccessKey: process.env.S3SECRET,
    region: process.env.S3REGION
});
const uploadParams = {
    Bucket: process.env.S3BUCKETNAME,
    Key: '', // pass key
    Body: null, // pass file body
    ACL: 'public-read'
};
const s3 = {};
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;

exports.doBase64 = async function (file,folder,file_path="") {
    const s3Client = s3.s3Client;
    const params = s3.uploadParams; 
    var buf = new Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""),'base64');
    var file_path='/'+folder+'/'+uniqid()+ '.jpg';
    params.Key = process.env.S3_ENV+file_path;
    params.Body = buf;
    params.ContentEncoding= 'base64';
    params.ContentType= 'image/jpeg';
     params.ContentDisposition= 'attachment';
    // params.ContentType=  mime.lookup(file.name);
    try {
        const stored = await s3Client.upload(params).promise();
        return file_path;
      } catch (err) {
        return err;
    }

}

exports.doUpload = async function (file,folder,file_path="") {
    var s3Client = s3.s3Client;
    var params = s3.uploadParams;  
    if(file_path){
       this.doDelete(file_path);
    }
    // var file_path='/'+folder+'/'+uniqid()+ path.extname(file.name);
    var file_path = '/'+folder+'/'+file.name;
    params.Key = process.env.S3_ENV+file_path;
    params.Body = file.data;
      params.ContentDisposition= 'attachment';
    params.ContentType=  mime.lookup(file.name);
    try {
        const stored = await s3Client.upload(params).promise();
        return file_path;
      } catch (err) {
        return err;
    }
}


exports.doDelete = async function(file_path) {
    const s3Client = s3.s3Client;
    try {
        var params = {
            Bucket: process.env.S3BUCKETNAME,
            Key: process.env.S3_ENV + file_path
        };
        var res = await s3Client.deleteObject(params).promise();
        return res;
    } catch (err) {
        return err;
    }
}