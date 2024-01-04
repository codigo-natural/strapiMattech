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
      const responses = await Promise.all([
        openai.createImage({
          model: "dall-e-3", //dalle e 3 only support 1 image per request
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          response_format: "b64_json",
        }),
        openai.createImage({
          model: "dall-e-3", //dalle e 3 only support 1 image per request
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          response_format: "b64_json",
        }),
      ]);

      // console.log("format 64", response.data.data);
      const imageUrls = responses.map((response) => response.data.data[0]);

      const data = {
        data: {
          payload_in: { prompt: prompt },
          payload_out: { resp: imageUrls },
          users_permissions_user: users_permissions_user,
          Source: "MatDalle",
        },
      };

      await strapi.db.query("api::request.request").create(data);

      ctx.send({ data: imageUrls });
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
