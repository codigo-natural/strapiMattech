const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
    console.log("entre aqui");
    const { name, lastname, domainofstudy, occupation, activity_area, users_permissions_user } = ctx.request.body;

    try {
      
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `You are a human resources manager, and I need you to write a curriculum vitae based on the following options. Furthermore, I want you to create a professional profile and infer five professional activities based on the data I provide. Don't add references information and the note:
        
        Professional Profile: ${domainofstudy} ${occupation}

        Professional Experience: ${activity_area} ${occupation}
        `,
        temperature: 1.0,
        max_tokens: 1000,
      });

      const data = {
        data: {
          payload_in: {
            name: name, 
            lastname: lastname,
            domainofstudy: domainofstudy,
            activity_area: activity_area,
            occupation
          },
          payload_out: {
            resp: response.data.choices[0].text.trim(),
          },
          users_permissions_user: users_permissions_user,
          Source: "MatCV",
        },
      };

      const request = await strapi.db
        .query("api::request.request")
        .create(data);

      ctx.send({ data: response.data.choices[0].text.trim() });
    } catch (error) {
      console.error("Error try to generate the CV", error);
      ctx.badRequest({ error: "Error try to generate the CV" });
    }
  },
};
