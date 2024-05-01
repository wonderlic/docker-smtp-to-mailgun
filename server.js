const _ = require('lodash');
const process = require('process');
const SMTPServer = require('smtp-server').SMTPServer;
const simpleParser = require('mailparser').simpleParser;

const config = require('./config');
const overrides = require('./lib/overrides');
const mailer = require('./lib/mailer');

async function onConnect(session, callback) {
  if (config.DEBUG) console.log(`SMTP Connection received from: ${session.remoteAddress}`);
  callback();
}

async function onClose(session) {
  if (config.DEBUG) console.log(`SMTP Connection closed from: ${session.remoteAddress}`);
}

async function onData(stream, session, callback) {
  try {
    const parsed = await simpleParser(stream);
    const domainOverride = overrides.getDomainOverride(parsed, session);
    const mail = mailer.buildMail(parsed);
    await mailer.sendMail(mail, domainOverride);

    callback();
  } catch (ex) {
    console.error(ex);
    callback(ex);
  }
}

const _server = new SMTPServer({ authOptional: true, onConnect, onData, onClose });

_server.listen(config.port, null, () => {
  console.log(`Listening for SMTP messages on port ${config.port}`);
});

_server.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});

process.once('SIGINT', function (code) {
  console.log('SIGINT received...');
  _server.close();
});
process.once('SIGTERM', function (code) {
  console.log('SIGTERM received...');
  _server.close();
});
