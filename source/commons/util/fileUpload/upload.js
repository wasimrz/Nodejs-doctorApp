require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3Config = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  Bucket: process.env.AWS_BUCKET_NAME,
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname == 'identityProof') {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype == 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname == 'resume'){
    if (
      file.mimetype === 'application/msword' ||
      file.mimetype == 'application/pdf' ||
      file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }

  }else {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
};

const multerS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.AWS_BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    let pathNames = req.baseUrl.toString().split('/');
    let folderName = pathNames[pathNames.length - 1].toString();
    if (file.fieldname == 'identityProof') folderName += '/identityProof';
    // console.log(folderName);
    cb(
      null,
      folderName + '/' + new Date().toISOString() + '-' + file.originalname
    );
  },
});

const upload = multer({
  storage: multerS3Config,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // we are allowing only 5 MB files
  },
});

exports.profileImage = upload;
