const _ = require('lodash');
const SMTPServer = require('smtp-server').SMTPServer;
const simpleParser = require('mailparser').simpleParser;

const config = require('./config');
const overrides = require('./lib/overrides');
const mailer = require('./lib/mailer');

async function onData(stream, session, callback) {
  try {
    const parsed = await simpleParser(stream);
    const domainOverride = overrides.getDomainOverride(parsed);
    const mail = mailer.buildMail(parsed);
    mailer.sendMail(mail, domainOverride);

    callback();
  } catch (ex) {
    callback(ex);
  }
}

const _server = new SMTPServer({ authOptional: true, onData });

_server.listen(config.port, null, () => {
  console.log(`Listening for SMTP messages on port ${config.port}`);
});

_server.on('error', (err) => {
  console.log(`Error: ${err.message}`);
});
