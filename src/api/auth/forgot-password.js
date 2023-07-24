// File: /api/auth/forgot-password.js
"use strict";
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

module.exports = {
  forgotPassword: async (ctx) => {
    const body = ctx.request.body;
    const email = body.email;

    try {
      // Find the user in the database based on the provided email
      const user = await strapi.plugins['users-permissions'].services.user.fetch({ email });

      if (!user) {
        // User not found
        return ctx.send({ error: "User not found" }, 404);
      }

      // Generate a unique reset token (you can use 'uuid' library for this)
      const resetToken = uuidv4();

      // Save the reset token and its expiration time in the database (you'll need to add these fields in your User model)

      // Assuming you have fields named 'resetToken' and 'resetTokenExpires' in your User model
      await strapi.query('user', 'users-permissions').update(
        { id: user.id },
        { resetToken, resetTokenExpires: Date.now() + 3600000 } // Expires in 1 hour
      );

      // Send the password reset email to the user
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
        to: email,
        subject: "Password Reset",
        text: `Hello ${user.username},\n\nYou have requested to reset your password. Click the following link to reset your password: ${'http://localhost:3000'}/reset-password?token=${resetToken}`,
        html: `<h1>Password Reset</h1><p>Hello ${user.username},</p><p>You have requested to reset your password. Click the following link to reset your password: <a href="${'http://localhost:3000'}/reset-password?token=${resetToken}">${YOUR_NEXTJS_APP_URL}/reset-password?token=${resetToken}</a></p>`,
      });

      ctx.send({ message: "Password reset email sent" });
      console.log("Correo enviado: %s", info);
    } catch (error) {
      console.log("Error al enviar el correo:", error);
      ctx.send({ error: "Error sending email" });
    }
  },
};
