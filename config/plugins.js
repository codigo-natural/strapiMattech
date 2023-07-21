// config/plugin.js
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
              user: env("SMTP_USER"),
              pass: env("SMTP_PASS"),
            },
            // ... any custom nodemailer options
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
      testAddres: env("SMTP_USER"),
    },
  },
  // ...
});
