# wonderlic/smtp-to-mailgun

### Links

- github: [https://github.com/wonderlic/docker-smtp-to-mailgun](https://github.com/wonderlic/docker-smtp-to-mailgun)
- docker hub: [https://registry.hub.docker.com/u/wonderlic/smtp-to-mailgun/](https://registry.hub.docker.com/u/wonderlic/smtp-to-mailgun/)

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

- PORT defaults to 25

You can set the environment variable MAILGUN_DOMAINS to an array of different mailgun domains, you can choose either fields on the email with setting fieldMatch to the field you want to run a regex against or you can run a regex against a specific header by setting the field headerMatch
Example:
[
{"name":"beta","domain":"beta-mg.yourdomain.com","regex":"Hello","fieldMatch":"subject",default:true},
{"name":"sandbox","domain":"sandbox-mg.yourdomain.com","regex":"Sandbox-Server","headerMatch":"recieved"}
]

This will provide 2 routes to check. The first one will look at the subject of the email, and if it contains "Hello", it will route it through beta-mg.yourdomain.com on mailgun. The second will look at the header called "recieved" and see if it contains Sandbox-Server, if it does it will route through sandbox-mg.yourdomain.com. If both of these tests fail it will use whatever is configured with default:true.

If an email would match muliple domains, it will use the first one in the list, that matches the criteria.
