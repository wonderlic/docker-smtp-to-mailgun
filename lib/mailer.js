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
    'o:tag': getTags(parsed),
  };
}

function getTags(parsed) {
  let allTags = [];
  for (const mailtag of config.mailgunTags) {
    const { match, tags } = mailtag;
    if (match.field) {
      const matchField = _.get(parsed, match.field);
      if (matchField.match(match.regex)) {
        allTags = allTags.concat(tags);
      }
    } else if (match.header) {
      const headers = _.get(parsed, 'headerLines');
      for (const header of headers) {
        if (header.key === match.header && header.line.match(match.regex)) {
          allTags = allTags.concat(tags);
        }
      }
    }
  }
  return allTags;
}

async function sendMail(mail, mailgunDomain = config.mailgunDomain) {
  return new Promise(function (resolve, reject) {
    const mailer = _getMailer(mailgunDomain);
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
