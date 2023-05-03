const email = require("../controllers/correo");

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/email",
      handler: email.send,
      config: {},
    },
  ],
};
