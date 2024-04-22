const defaults = {
  PORT: '25',
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

const config = {
  port: getIntEnvVar('PORT'),
  mailgunAPIKey: getEnvVar('MAILGUN_API_KEY'),
  mailgunDomain: getEnvVar('MAILGUN_DOMAIN'),
  mailgunDomainOverrides: getJSONEnvVar('MAILGUN_DOMAIN_OVERRIDES'),
};

module.exports = config;
