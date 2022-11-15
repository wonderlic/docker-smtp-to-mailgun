const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

const config = require('./config');

const _mailer = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: config.mailgunAPIKey,
      domain: config.mailgunDomain,
    },
  })
);

async function sendMail(mail) {
  return new Promise(function (resolve, reject) {
    _mailer.sendMail(mail, (err, info) => {
      if (err) {
        return reject(err);
      }
      if (!info) {
        return reject(new Error('Unknown error sending email.'));
      }
      const messageId = info.id.replace('<', '').replace('>', '');
      console.log(`Email sent to '${mail.to}' with subject '${mail.subject}'. (message-id: '${info.id}')`);
      resolve(messageId);
    });
  });
}

module.exports.sendMail = sendMail;
