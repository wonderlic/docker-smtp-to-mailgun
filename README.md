# wonderlic/smtp-to-mailgun

## Links

- github: [https://github.com/wonderlic/docker-smtp-to-mailgun](https://github.com/wonderlic/docker-smtp-to-mailgun)
- docker hub: [https://registry.hub.docker.com/u/wonderlic/smtp-to-mailgun/](https://registry.hub.docker.com/u/wonderlic/smtp-to-mailgun/)

## Description

This docker image will start a SMTP server in node.js and forward any incoming SMTP messages to MailGun for delivery.

## Usage

```
docker run \
  -e PORT=... \
  -e MAILGUN_API_KEY=... \
  -e MAILGUN_DOMAIN=... \
  wonderlic/smtp-to-mailgun
```

If not set:

- PORT defaults to 25

## Optional:

### Using additional domains

You can set the environment variable MAILGUN_DOMAIN_OVERRIDES to a JSON array of rule objects that specify alternate MailGun sending domains.
Each rule object in the JSON array should have a "match" sub-object and a "domain" field.
The "match" sub-object should have a "session", "header", or , "field" field and a "regex" field.
The "match" values will be checked against the incoming email. If a match is found, the value of the "domain" field will be used when sending the email.

The valid values for "session" can be found in the SMTP Server documentation: https://nodemailer.com/extras/smtp-server/#session-object
The valid values for "field" and "header" can be found in the MailParser documentation: https://nodemailer.com/extras/mailparser/#mail-object

Example:

```
[
  {"match": {"session": "hostNameAppearsAs", "regex": "/^Sandbox-.*/i"}, "domain": "sandbox-mg.yourdomain.com"},
  {"match": {"header": "message-id", "regex": ".*SANDBOX-.*"}, "domain": "sandbox-mg.yourdomain.com"},
  {"match": {"field": "from.text", "regex": ".*-Beta@.*"}, "domain": "beta-mg.yourdomain.com"},
]
```

This example specifies 3 rules to check:

- The first one will look at the hostname of the sending client of the email.  If it starts with "Sandbox-" (case insensitive), it will send the email with the sandbox-mg.yourdomain.com MailGun domain.
- The second one will look at the header called "recieved". If it contains "SANDBOX-", it will send the email with the sandbox-mg.yourdomain.com MailGun domain.
- The third one will look at the From address of the email. If it contains "-Beta@", it will send the email with the beta-mg.yourdomain.com MailGun domain.
- If none of these rules match, it will fallback to whatever is configured with the default MAILGUN_DOMAIN environment variable.
- If an email would match multiple rules, it will use the first one in the array that matches the criteria.

### Using mailgun tags

You can set the environment variable MAILGUN_TAGS to a JSON array of rule objects that specify the tag to apply.
Each rule object in the JSON array should have a "match" sub-object and a "tags" array.
The "match" sub-object should have either a "field" or a "header" field and a "regex" field.
The "match" values will be checked against the incoming email. If a match is found, the tags will be applied.

The valid values for "field" and "header" can be found in the MailParser documentation: https://nodemailer.com/extras/mailparser/#mail-object

Example:

```
[
  {"match": {"field": "subject", "regex": ".*Hello.*"},"tags":["new_user","welcome_email"]},
  {"match": {"header": "message-id", "regex": ".*BETA-.*"},"tags":["from_beta"]},
]
```
