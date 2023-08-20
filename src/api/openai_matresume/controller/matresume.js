const { Configuration, OpenAIApi } = require("openai");
//const {encode, decode} = require('gpt-3-encoder')

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
    console.log("entre aqui");
    const { prompt, users_permissions_user, language } = ctx.request.body;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `You are an AI assistant fluent in multiple languages. Your role is to generate a concise summary in the detected language when given a text input.

        The input will contain a text {prompt} and the {language}
        
        Generate a summary that captures the key information from the text snippet without losing important details. The summary should be 3-5 sentences long.
        
        Example:
        
        Input: "The text is {The Eiffel Tower is one of the most recognizable landmarks in Paris and a symbol of France. It was built in 1889 to celebrate the 100th anniversary of the French Revolution. The Eiffel Tower is an impressive cast-iron structure that is 324 meters high. It was once the tallest building in the world and is now a popular tourist attraction. The top of the tower offers a breathtaking view over the city of Paris. Millions of people visit the Eiffel Tower every year to experience its beauty and history.} in {english}."
        
        Correct summary:
        
        The Eiffel Tower is a landmark of Paris and a national symbol of France. Built in 1889 to celebrate the French Revolution, it is 324 meters high. From its top there is a breathtaking view of Paris. Millions of tourists visit the Eiffel Tower annually for its beauty and history.
        -- 
        input: "The text is ${prompt} in ${language}"
        Correct Ouput:
        `,
        temperature: 1.0,
        max_tokens: 1000,
      });
      console.log(response.data.choices);
      const data = {
        data: {
          payload_in: { prompt: prompt },
          payload_out: { resp: response.data.choices[0].text.trim() },
          users_permissions_user: users_permissions_user,
          Source: "MatResume",
        },
      };
      const request = await strapi.db
        .query("api::request.request")
        .create(data);

      ctx.send({ data: response.data.choices[0].text.trim() });
    } catch (err) {
      ctx.badRequest("Could not generate response :" + err);
    }
  },
};