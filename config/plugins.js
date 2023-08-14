// config/plugin.js
const nodemailerNTLMAuth = require("nodemailer-ntlm-auth");
module.exports = ({ env }) => ({
  email: {
    config: {
      providers: [
        {
          provider: "nodemailer",
          providerOptions: {
            host: env("SMTP_HOST"),
            port: env("SMTP_PORT"),
            auth: {
              type: "custom",
              method: "NTLM",
              user: env("SMTP_USER"),
              pass: env("SMTP_PASS"),
            },
            customAuth: {
              NTLM: nodemailerNTLMAuth,
            },
          },
        },
        {
          provider: "sendmail",
          providerOptions: {
            host: env("SMTP_HOST"),
            port: env("SMTP_PORT"),
            auth: {
              user: env("SMTP_USER"),
              pass: env("SMTP_PASS"),
            },
            // ... any custom sendmail options
          },
        },
      ],
    },
    settings: {
      defaultFrom: env("SMTP_USER"),
      defaultReplyTo: env("SMTP_USER"),
      testAddress: env("SMTP_USER"),
    },
  },
  // ...
});
