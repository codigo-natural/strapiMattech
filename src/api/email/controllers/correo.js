// File /api/email/controllers/Email.js
"use strict";
const nodemailer = require("nodemailer");

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

module.exports = {
  send: async (ctx) => {
    const body = ctx.request.body;
    const sendTo = body.email;
    try {
      let transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: true, // Enable SSL/TLS
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      let info = await transporter.sendMail({
        from: smtpUser,
        to: sendTo,
        subject: `Asunto: message from ${body.company}`,
        text: "Este es el contenido del correo",
        html: `<h1>Welcome!</h1><p>${body.message} name: ${body.name} lastname: ${body.lastName}</p>`,
      });

      ctx.send({ message: "Email sent" });
      console.log("Correo enviado: %s", info);
    } catch (error) {
      console.log("Error al enviar el correo:", error);
      ctx.send({ error: "Error sending email" });
    }
  },
};
