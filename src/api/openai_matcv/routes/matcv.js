const openai = require("../controller/matcv");
const openaiExp = require("../controller/matcvExperience");
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/openai/matcv",
      handler: openai.generateResponse,
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/openai/matcvExperience",
      handler: openaiExp.generateExperience,
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
