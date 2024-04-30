const _ = require('lodash');
const config = require('./../config');

function getDomainOverride(parsed, session) {
  for (const domainOverride of config.mailgunDomainOverrides) {
    const {match, domain} = domainOverride;
    if (match.field) {
      const matchField = _.get(parsed, match.field);
      if (config.DEBUG) console.log(`Checking Field: '${match.field}', RegEx: ${match.regex}, Value: '${matchField}'`);
      if (matchField && matchField.match(match.regex)) {
        if (config.DEBUG) console.log(`... Match Found! Overriding Domain: '${domain}'`);
        return domain;
      }
    } else if (match.header) {
      const headers = _.get(parsed, 'headerLines');
      for (const header of headers) {
        if (header.key === match.header) {
          if (config.DEBUG) console.log(`Checking Header: '${match.header}', RegEx: ${match.regex}, Value: '${header.line}'`);
          if (header.line && header.line.match(match.regex)) {
            if (config.DEBUG) console.log(`... Match Found! Overriding Domain: '${domain}'`);
            return domain;
          }
        }
      }
    } else if (match.session) {
      const matchSession = _.get(session, match.session);
      if (config.DEBUG) console.log(`Checking Session: '${match.session}', RegEx: ${match.regex}, Value: '${matchSession}'`);
      if (matchSession && matchSession.match(match.regex)) {
        if (config.DEBUG) console.log(`... Match Found! Overriding Domain: '${domain}'`);
        return domain;
      }
    }
  }
}

module.exports.getDomainOverride = getDomainOverride;
