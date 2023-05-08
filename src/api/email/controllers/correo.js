// File /api/email/controllers/Email.js
"use strict";
const nodemailer = require("nodemailer");

const passGmail = process.env.SMTP_PASS_GMAIL;
const userGmail = process.env.SMTP_USER;
const emailService = process.env.EMAIL_SERVICE;

module.exports = {
  send: async (ctx) => {
    const body = ctx.request.body;
    const sendTo = body.email;
    try {
      let transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
          user: userGmail,
          pass: passGmail,
        },
      });

      let info = await transporter.sendMail({
        from: userGmail,
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

/**
 * Read the documentation () to implement custom controller functions
 */

// send: async (ctx) => {
//   const body = ctx.request.body;
//   const sendTo = body.email;
//   strapi.log.debug(`Trying to send an email to ${sendTo}`);

//   try {
//     const emailOptions = {
//       to: sendTo,
//       subject: "This is a test",
//       html: `<h1>Welcome!</h1><p>This is a test HTML email.</p>`,
//     };
//     await strapi.plugins["email"].services.email.send(emailOptions);
//     strapi.log.debug(`Email sent to ${sendTo}`);
//     ctx.send({ message: "Email sent" });
//   } catch (err) {
//     strapi.log.error(`Error sending email to ${sendTo}`, err);
//     ctx.send({ error: "Error sending email" });
//   }
// },
