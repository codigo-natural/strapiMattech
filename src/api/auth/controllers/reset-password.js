module.exports = {
  resetPassword: async (ctx) => {
    const body = ctx.request.body;
    const { token: resetToken, newPassword } = body;

    try {
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ where: { resetPasswordToken: resetToken } }); // Use the resetToken to find the user

      if (!user) {
        return ctx.badRequest("Invalid token");
      }

      strapi.admin.services.auth
        .hashPassword(newPassword)
        .then((hashedPassword) => {
          strapi
            .query("plugin::users-permissions.user")
            .update({
              where: { id: user.id },
              data: {
                password: hashedPassword,
              },
            })
            .then(() => console.log("Updated successfully."))
            .catch((ex) => console.error("Failed to update password.", ex));
        })
        .catch((ex) =>
          console.error("Failed to hash password and update it.", ex)
        );

      // console.log("temino el update");

      // Respond with a success message
      ctx.send({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      ctx.badRequest("Password reset failed");
    }
  },
};
