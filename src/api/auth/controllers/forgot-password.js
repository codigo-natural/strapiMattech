const nodemailer = require("nodemailer");
const crypto = require("crypto");

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
module.exports = {
  forgotPassword: async (ctx) => {
    const body = ctx.request.body;
    const email = body.email;

    console.log("Email arrived:", email);

    try {
      // Find the user in the database based on the provided email
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ where: { email: email } });
      if (!user) {
        // User not found
        return ctx.send({ error: "User not found" }, 404);
      }

      // Generate a unique reset token
      const resetToken = crypto.randomBytes(32).toString("hex"); // Adjust the byte length as needed

      // Update the user's reset token and its expiration time

      await strapi.query("plugin::users-permissions.user").update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpires: Date.now() + 3600000,
        },
      });

      // Create transporter for sending email
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: true, // Enable SSL/TLS
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      // http://localhost:3000/reset-password/
      // Send the password reset email to the user
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      const mailOptions = {
        from: "your@email.com",
        to: email,
        subject: "Password Reset",
        text: `Hello ${user.username},\n\nYou have requested to reset your password. Click the following link to reset your password: ${resetUrl}`,
        html: `<h1>Password Reset</h1><p>Hello ${user.username},</p><p>You have requested to reset your password. Click the following link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
      };
      const info = await transporter.sendMail(mailOptions);

      // Respond with success message
      ctx.response.status = 200;
      ctx.response.body = { message: "Password reset email sent" };
      console.log("Correo enviado:", info);
    } catch (error) {
      // Respond with error
      ctx.response.status = 500;
      ctx.response.body = {
        error: "Error sending email",
        details: error.message,
      };
      console.log("Error al enviar el correo:", error);
    }
  },
};
