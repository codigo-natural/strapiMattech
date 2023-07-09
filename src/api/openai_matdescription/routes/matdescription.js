const openai = require("../controller/matdescription");
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/openai/matdescription",
      handler: openai.generateDescription,
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
