const auth = require("../controllers/forgot-password");

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/auth/reset-password",
      handler: auth.forgotPassword,
      config: {},
    },
  ],
};
