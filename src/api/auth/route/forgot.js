const auth = require("../controllers/forgot");

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/forgot",
      handler: auth.forgotPassword,
      config: {},
    },
  ],
};
