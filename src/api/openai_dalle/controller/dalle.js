const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
    // console.log("entre aqui");
    const { prompt, users_permissions_user } = ctx.request.body;

    try {
      const response = await openai.createImage({
        prompt: prompt,
        n: 2,
        size: "512x512",
        response_format: "b64_json",
      });

      // console.log("format 64", response.data.data);
      const data = {
        data: {
          payload_in: { prompt: prompt },
          payload_out: { resp: response.data.data },
          users_permissions_user: users_permissions_user,
          Source: "MatDalle",
        },
      };
      const request = await strapi.db
        .query("api::request.request")
        .create(data);

      ctx.send({ data: response.data.data });
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  },
};
