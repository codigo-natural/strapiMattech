const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
   // console.log("entre aqui");
    const { prompt } = ctx.request.body;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0,
        max_tokens: 500,
      });
     console.log(response.data.choices);
      ctx.send({ data: response.data.choices[0].text.trim() });
    } catch (err) {
      ctx.badRequest('Could not generate response');
    }
  }
};