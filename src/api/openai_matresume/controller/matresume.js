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
        prompt: `You are an AI assistant fluent in multiple languages. Your role is to generate a concise summary in the detected language when given a  text input.

        The input will contain a text {snippet} and the {language}
        
        Generate a summary that captures the key information from the text snippet without losing important details. The summary should be 3-5 sentences long.
        
        Example:
        
        Input: "The text is {{"Der Eiffelturm ist eines der bekanntesten Wahrzeichen von Paris und ein Symbol für Frankreich. Er wurde im Jahr 1889 zur Feier des 100. Jahrestags der Französischen Revolution erbaut. Der Eiffelturm ist ein beeindruckendes Bauwerk aus Gusseisen, das eine Höhe von 324 Metern hat. Er war einst das höchste Gebäude der Welt und ist heute eine beliebte Touristenattraktion. Von der Spitze des Turms aus bietet sich ein atemberaubender Blick über die Stadt Paris. Jährlich besuchen Millionen von Menschen den Eiffelturm, um seine Schönheit und Geschichte zu erleben."}} and in [german] language."
        
        Correct summary:
        
        Der Eiffelturm ist ein Wahrzeichen von Paris und nationales Symbol Frankreichs. 1889 zur Feier der Französischen Revolution erbaut, beeindruckt er mit 324 Metern Höhe. Von seiner Spitze bietet sich ein atemberaubender Blick auf Paris. Millionen Touristen besuchen den Eiffelturm jährlich wegen seiner Schönheit und Geschichte.
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