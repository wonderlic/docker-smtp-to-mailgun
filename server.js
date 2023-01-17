const _ = require('lodash');
const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const mailer = require ('./mailer');

const config = require('./config');

async function onData(stream, session, callback) {
  try {
    const parsed = await simpleParser(stream);
    const mail = {
      from: _.get(parsed, 'from.text'),
      to: _.get(parsed, 'to.text'),
      cc: _.get(parsed, 'cc.text'),
      bcc: _.get(parsed, 'bcc.text'),
      subject: _.get(parsed, 'subject'),
      text: _.get(parsed, 'text'),
      html: _.get(parsed, 'html'),
      attachments: _.get(parsed, 'attachments'),
    }
    //console.log('Message Received:', mail, session);
    mailer.sendMail(mail);

    callback();
  } catch (ex) {
    callback(ex);
  }
}

const _server = new SMTPServer({authOptional: true, onData});

_server.listen(config.port, null, () => {
  console.log(`Listening for SMTP messages on port ${config.port}`);
});

_server.on("error", err => {
  console.log(`Error: ${err.message}`);
});
