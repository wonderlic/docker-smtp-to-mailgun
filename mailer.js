const _ = require('lodash');
const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

const config = require('./config');

const _mailers = {};
if (config.mailgunDomains) {
  config.mailgunDomains.forEach((domain) => {
    _mailers[domain.name] = nodemailer.createTransport(
      mailgunTransport({
        auth: {
          api_key: config.mailgunAPIKey,
          domain: domain.domain,
        },
      })
    );
  });
}

const _mailer = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: config.mailgunAPIKey,
      domain: config.mailgunDomain,
    },
  })
);

async function sendMail(mail, domain) {
  return new Promise(function (resolve, reject) {
    const domainMailer = domain ? _mailers[domain] : _mailer;
    domainMailer.sendMail(mail, (err, info) => {
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

function findDomain(parsed) {
  if (!config.mailgunDomains) {
    return null;
  }

  for (const mailgunDomain of config.mailgunDomains) {
    if (mailgunDomain.fieldMatch) {
      const matchField = _.get(parsed, mailgunDomain.fieldMatch);
      if (mailgunDomain.regex.test(matchField)) {
        return mailgunDomain.name;
      }
    } else if (mailgunDomain.headerMatch) {
      const headers = _.get(parsed, 'headerLines');
      for (const header of headers) {
        if (mailgunDomain.regex.test(header.line)) {
          return mailgunDomain.name;
        }
      }
    }
  }

  const mailgunDomain = _.find(config.mailgunDomains, ['default', true]);
  if (mailgunDomain) {
    return mailgunDomain.name;
  }

  throw new Error('No usable domain configured. Try specifying a default domain.');
}

module.exports.sendMail = sendMail;
module.exports.findDomain = findDomain;
