module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
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
      settings: {
        defaultFrom: env("SMTP_USER"),
        defaultReplyTo: env("SMTP_USER"),
      },
    },
  },
  // ...
});

