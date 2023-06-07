// Import your custom OpenAI controller
const openai = require("../controller/sportcoach");
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/openai/sportcoach",
      handler: openai.generateResponse,
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};