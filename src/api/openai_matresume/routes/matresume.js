const openai = require("../controller/matresume");
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/openai/matresume",
      handler: openai.generateResponse,
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};