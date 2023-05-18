// Import your custom OpenAI controller
const openai = require("../controller/mattranslate");
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/openai/mattranslate",
      handler: openai.generateResponse,
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
