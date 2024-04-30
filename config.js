const defaults = {
  PORT: '25',
  MAILGUN_DOMAIN_OVERRIDES: '[]',
  MAILGUN_TAGS: '[]',
  DEBUG: 'false',
};

function getEnvVar(key) {
  return process.env[key] || defaults[key];
}
function getIntEnvVar(key) {
  return parseInt(getEnvVar(key));
}
function getBoolEnvVar(key) {
  return getEnvVar(key) === 'true';
}
function getJSONEnvVar(key) {
  return JSON.parse(getEnvVar(key));
}

function getJSONWithMatchRegexEnvVar(key) {
  const retVal = getJSONEnvVar(key);
  for (const rule of retVal) {
    const {match} = rule;
    match.regex = parseRegex(match.regex);
  }
  return retVal;
}

function parseRegex(regex) {
  const pos1 = regex.indexOf('/');
  const pos2 = regex.lastIndexOf('/');
  if (pos1 === 0 && pos2 > 1) {
    const str = regex.slice(1, pos2);
    const options = regex.slice(pos2 + 1);
    return new RegExp(str, options);
  }
  return new RegExp(regex);
}

const config = {
  port: getIntEnvVar('PORT'),
  mailgunAPIKey: getEnvVar('MAILGUN_API_KEY'),
  mailgunDomain: getEnvVar('MAILGUN_DOMAIN'),
  mailgunDomainOverrides: getJSONWithMatchRegexEnvVar('MAILGUN_DOMAIN_OVERRIDES'),
  mailgunTags: getJSONWithMatchRegexEnvVar('MAILGUN_TAGS'),
  DEBUG: getBoolEnvVar('DEBUG'),
};

console.dir(config, {depth: null});
module.exports = config;
