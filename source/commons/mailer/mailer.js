/* eslint-disable max-len */
const nodeMailer = require('nodemailer');
const fetch = require('node-fetch');
const AWS = require('aws-sdk');
// const axios = require('axios');
const logger = require('../logger/logger.js');
require('dotenv').config();

function sendEmail(data) {
  logger.info('Email instance initated.........');
  const transporter = nodeMailer.createTransport({
    host: process.env.ZOHO_SMTP_SERVER,
    port: process.env.ZOHO_SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.ZOHO_USERNAME,
      pass: process.env.ZOHO_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.ZOHO_FROM_ADDRESS, // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    // text: data.body, // plain text body
    html: data.template// html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    logger.info(`Sending an Email to.........${data.to}`);
    if (error) {
      logger.error('Error while sending an email........');
      console.log(error);
      return error;
    }
    logger.info('Message %s sent: %s', info.messageId, info.response);
    return 'Email Sent';
  });
}

function sendTransactionalEmail(data) {
  // logger.info('Transactional Email instance initated.........');
  const transporter = nodeMailer.createTransport({
    host: process.env.ZEPTO_SMTP_SERVER,
    port: process.env.ZEPTO_SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.ZEPTO_USERNAME,
      pass: process.env.ZEPTO_PASSWORD1
    }
  });

  const mailOptions = {
    from: process.env.ZEPTO_FROM_ADDRESS, // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    // text: data.body, // plain text body
    html: data.template // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log(info.messageId, info.response);
    logger.info(`Sending an Email to.........${data.to}`);
    if (error) {
      logger.error('Error while sending an email........');
      console.log(error);
      return error;
    }
    logger.info('Message %s sent: %s', info.messageId, info.response);
    return 'Email Sent';
  });
}

async function sendMail2(data) {
  var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'no-replymailer@mobiloitte.com',
      pass: '%FEy=9FF@'
    }
  });
  var mailOptions = {
    from: {
      name: 'Doctor-Dentist Smart App', //no-replymailer@mobiloitte.com",
      address: 'no-replymailer@mobiloitte.com'
    },
    to: data.to,
    subject: data.body,
    html: data.template
  };
  return await transporter.sendMail(mailOptions);
}

function sendAWSEmail(data) {
  AWS.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_SES_REGION
  });

  const ses = new AWS.SES({ apiVersion: '2010-12-01' });

  const params = {
    Destination: {
      ToAddresses: [data.to]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: data.body
        }
        /* replace Html attribute with the following if you want to send plain text emails.
                Text: {
                    Charset: "UTF-8",
                    Data: message
                }
             */
      },
      Subject: {
        Charset: 'UTF-8',
        Data: data.subject
      }
    },
    Source: process.env.AWS_FROM,
    ReplyToAddresses: [process.env.AWS_REPLY]
  };

  ses.sendEmail(params, (err, resData) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info('Email sent...');
      logger.info(resData);
    }
  });
}

async function sendSMS(data) {
  // const baseURL = process.env.SMS_URL;
  // const apiKey = process.env.SMS_ACCESS_KEY;
  // const sender = process.env.SMS_SENDER;

  // const url = `${baseURL}?apikey=${apiKey}&numbers=${data.to}&sender=${sender}&message=${data.body}`;
  // logger.info('Creating payload to send the SMS............');

  // axios.get(url)
  //   .then((response) => {
  //     logger.info(response.data);
  //   })
  //   .catch((error) => {
  //     logger.error(error);
  //   });

  try {
    // AWS.config.update({
    //   accessKeyId: process.env.AWS_SMS_ACCESS_KEY,
    //   secretAccessKey: process.env.AWS_SMS_SECRET_KEY,
    //   region: process.env.AWS_SMS_REGION,
    // });

    // Create SMS Attribute parameters
    // const params = {
    //   PhoneNumber: data.to,
    //   Message: data.body,
    //   MessageAttributes: {
    //     'AWS.SNS.SMS.SMSType': {
    //       DataType: 'String',
    //       StringValue: 'Transactional',
    //     },
    //   },
    // };

    // Create promise and SNS service object
    // const publishTextPromise = new AWS.SNS().publish(params).promise();

    // Handle promise's fulfilled/rejected states
    // publishTextPromise.then(
    //   (smsRes) => {
    //     logger.info('OTP Sent successfully....');
    //     logger.info(smsRes);
    //   },
    // ).catch(
    //   (err) => {
    //     logger.error(err);
    //   },
    // );

    // const accessKey = process.env.TWOFACTOR_ACCESS_KEY;
    // let url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=${accessKey}&to=${data.to}&from=GRAYMA&templatename=${data.template}`;
    // if (data.var1 !== undefined) {
    //   url += `&var1=${data.var1}`;
    // }

    // if (data.var2 !== undefined) {
    //   url += `&var2=${data.var2}`;
    // }

    // if (data.var3 !== undefined) {
    //   url += `&var3=${data.var3}`;
    // }
    console.log('545454545454', data);
    let apiKey = process.env.SMSPROVIDER_APIKEY;
    let url = `https://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=${apiKey}&MobileNo=${data.to}&SenderID=DRTETH&Message=${data.body}&ServiceName=TEMPLATE_BASED&DLTTemplateID=${data.template}`;
    logger.info(url);
    let isSent = await fetch(url);
    logger.info(isSent.body);
    return isSent;
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  sendEmail,
  sendAWSEmail,
  sendSMS,
  sendTransactionalEmail,
  sendMail2
};
