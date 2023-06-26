const openai = require("../controller/matdescription");
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/openai/matdescription",
      handler: openai.generateResponse,
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
