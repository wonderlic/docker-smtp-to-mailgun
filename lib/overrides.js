const _ = require('lodash');
const config = require('./../config');

function getDomainOverride(parsed) {
  for (const domainOverride of config.mailgunDomainOverrides) {
    const {match, domain} = domainOverride;
    if (match.field) {
      const matchField = _.get(parsed, match.field);
      if (matchField.match(match.regex)) {
        return domain;
      }
    } else if (match.header) {
      const headers = _.get(parsed, 'headerLines');
      for (const header of headers) {
        if (header.key === match.header && header.line.match(match.regex)) {
          return domain;
        }
      }
    }
  }
}

module.exports.getDomainOverride = getDomainOverride;
