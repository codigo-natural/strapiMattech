const auth = require("../controllers/forgot-password");
const authReset = require("../controllers/reset-password");
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/auth/forgot-password",
      handler: auth.forgotPassword,
      config: {},
    },
    {
      method: "POST",
      path: "/auth/reset-password",
      handler: authReset.resetPassword,
      config: {},
    },
  ],
};
