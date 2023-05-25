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
         subject: "Re: Merci pour votre demande chez MATTECH",
         text: `Cher(e) ${body.name},\n\nNous vous remercions d'avoir pris le temps de remplir notre formulaire de contact. Votre demande a bien été reçue et est en cours de traitement par notre équipe.\n\nNous mettons un point d'honneur à répondre à toutes les demandes dans les plus brefs délais. Cependant, veuillez noter que notre temps de réponse peut varier en fonction du volume de demandes que nous recevons. Notre objectif est de vous répondre dans les 24-48 heures.\n\nNous apprécions votre patience et votre compréhension, et nous nous réjouissons à l'idée de vous aider avec votre demande.\n\nCordialement,\n\nHUBERT Matthieu\nPARIS\nMATTECH\n\nEmail: Matthieu.hubert@mattech-ia.com`,
         html: `<h1>Re: Merci pour votre demande chez MATTECH</h1><p>Cher(e) ${body.name},</p><p>Nous vous remercions d'avoir pris le temps de remplir notre formulaire de contact. Votre demande a bien été reçue et est en cours de traitement par notre équipe.</p><p>Nous mettons un point d'honneur à répondre à toutes les demandes dans les plus brefs délais. Cependant, veuillez noter que notre temps de réponse peut varier en fonction du volume de demandes que nous recevons. Notre objectif est de vous répondre dans les 24-48 heures.</p><p>Nous apprécions votre patience et votre compréhension, et nous nous réjouissons à l'idée de vous aider avec votre demande.</p><p>Cordialement,</p><p>HUBERT Matthieu<br>PARIS<br>MATTECH</p><p>Email: <a href="mailto:Matthieu.hubert@mattech-ia.com">Matthieu.hubert@mattech-ia.com</a></p>`,
              });

      ctx.send({ message: "Email sent" });
      console.log("Correo enviado: %s", info);
    } catch (error) {
      console.log("Error al enviar el correo:", error);
      ctx.send({ error: "Error sending email" });
    }
  },
};
