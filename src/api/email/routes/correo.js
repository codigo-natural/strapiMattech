const email = require("../controllers/correo");

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/emails",
      handler: email.send,
      config: {},
    },
  ],
};
