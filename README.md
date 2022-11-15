# wonderlic/smtp-to-mailgun

### Links

* github: [https://github.com/wonderlic/docker-smtp-to-mailgun](https://github.com/wonderlic/docker-smtp-to-mailgun)
* docker hub: [https://registry.hub.docker.com/u/wonderlic/smtp-to-mailgun/](https://registry.hub.docker.com/u/wonderlic/smtp-to-mailgun/)

### Description

This docker image will start a SMTP server in node.js and forward any incoming SMTP messages to MailGun for delivery.

### Usage

```
docker run \
  -e PORT=... \
  -e MAILGUN_API_KEY=... \
  -e MAILGUN_DOMAIN=... \
  wonderlic/smtp-to-mailgun
```

If not set:
*  PORT defaults to 25
