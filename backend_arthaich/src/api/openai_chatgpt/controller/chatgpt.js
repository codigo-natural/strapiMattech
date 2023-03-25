const { Configuration, OpenAIApi } = require("openai");
const {encode, decode} = require('gpt-3-encoder')
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
     const encoded = encode(response.data.choices[0].text);
     //console.log('Encoded this string looks like: ', encoded)
     console.log("Tokens are" + encoded.length);
     // console.log('We can look at each token and what it represents')

      ctx.send({ data: response.data.choices[0].text.trim() });
    } catch (err) {
      ctx.badRequest('Could not generate response');
      
    }
  }
};

