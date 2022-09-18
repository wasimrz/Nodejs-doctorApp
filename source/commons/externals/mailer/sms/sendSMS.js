require('dotenv');
const fetch = require('node-fetch');
const axios=require('axios')
async function send(msg) {
//   const accessURL = process.env.TWOFACTOR_API_URL.replace('{{accessKey}}', process.env.TWOFACTOR_ACCESS_KEY);
//   const headers   = { 'Content-Type': 'application/x-www-form-urlencoded' };
//   const params    = {
//     To: msg.mobile,
//     From: msg.from || 'GRAYMA',
//     TemplateName: msg.template,
//     VAR1: msg.var1,
//     VAR2: msg.var2,
//     VAR3: msg.var3,
//   }
//   const data = Object.keys(params).reduce((acc, curr) => `${acc}${curr}=${(params[curr])}&`, '');
//   const { ResourceAPI } = require('../../externalsManager');
  


  console.log("545454545454")
    let apiKey = process.env.SMSPROVIDER_APIKEY
    let url= `https://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=${apiKey}&MobileNo=${msg.to}&SenderID=DRTETH&Message=${msg.body}&ServiceName=TEMPLATE_BASED&DLTTemplateID=${msg.template}`
    // logger.info(url);
    let data=await axios(url)
  return data.data;
}

module.exports = { send };