// Import your custom OpenAI controller
const openai = require("../controller/matquiz");
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/openai/matquiz",
      handler: openai.generateResponse,
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
