const _ = require('lodash');
const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

const config = require('./../config');

const _mailers = {};

function _getMailer(mailgunDomain) {
  let mailer = _mailers[mailgunDomain];
  if (!mailer) {
    mailer = _mailers[mailgunDomain] = nodemailer.createTransport(
      mailgunTransport({
        auth: {
          api_key: config.mailgunAPIKey,
          domain: mailgunDomain,
        },
      })
    );
  }
  return mailer;
}

function buildMail(parsed) {
  return {
    from: _.get(parsed, 'from.text'),
    to: _.get(parsed, 'to.text'),
    cc: _.get(parsed, 'cc.text'),
    bcc: _.get(parsed, 'bcc.text'),
    subject: _.get(parsed, 'subject'),
    text: _.get(parsed, 'text'),
    html: _.get(parsed, 'html'),
    attachments: _.get(parsed, 'attachments'),
  };
}

async function sendMail(mail, mailgunDomain) {
  return new Promise(function (resolve, reject) {
    const mailer = _getMailer(mailgunDomain || config.mailgunDomain);
    mailer.sendMail(mail, (err, info) => {
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

module.exports.buildMail = buildMail;
module.exports.sendMail = sendMail;
