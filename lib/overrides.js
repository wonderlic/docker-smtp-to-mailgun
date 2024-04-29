const _ = require('lodash');
const config = require('./../config');

function getDomainOverride(parsed) {
  for (const domainOverride of config.mailgunDomainOverrides) {
    const {match, domain} = domainOverride;
    if (match.field) {
      const matchField = _.get(parsed, match.field);
      if (config.DEBUG) console.log(`Checking Field: '${match.field}', RegEx: '${match.regex}', Value: ${matchField}`);
      if (matchField.match(match.regex)) {
        if (config.DEBUG) console.log(`... Match Found! Overriding Domain: '${domain}'`);
        return domain;
      }
    } else if (match.header) {
      const headers = _.get(parsed, 'headerLines');
      for (const header of headers) {
        if (header.key === match.header) {
          if (config.DEBUG) console.log(`Checking Header: '${match.header}', RegEx: '${match.regex}', Value: ${header.line}`);
          if (header.line.match(match.regex)) {
            if (config.DEBUG) console.log(`... Match Found! Overriding Domain: '${domain}'`);
            return domain;
          }
        }
      }
    }
  }
}

module.exports.getDomainOverride = getDomainOverride;
