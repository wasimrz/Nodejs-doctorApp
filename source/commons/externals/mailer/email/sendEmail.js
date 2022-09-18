require('dotenv');
const AWS = require('aws-sdk');

async function send(data, isHTML = false) {
  AWS.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_SES_REGION,
    correctClockSkew: true,
  });

  const Body = isHTML ? { 
    Html: {
      Charset: 'UTF-8',
      Data: data.body,
    }
  } : {
    Text: {
      Charset: "UTF-8",
      Data: data.body
    }
  };

  const params = {
    Destination: {
      ToAddresses: [data.email],
    },
    Message: {
      Body,
      Subject: {
        Charset: 'UTF-8',
        Data: data.subject,
      },
    },
    Source: process.env.AWS_FROM,
    ReplyToAddresses: [
      process.env.AWS_REPLY,
    ],
  };

  return new AWS.SES({ apiVersion: process.env.AWS_API_VERSION }).sendEmail(params).promise();
}

module.exports = { send };