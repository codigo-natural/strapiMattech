const { Configuration, OpenAIApi } = require("openai");
//const {encode, decode} = require('gpt-3-encoder')

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
   // console.log("entre aqui");
    const { prompt, users_permissions_user } = ctx.request.body;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0,
        max_tokens: 500,
      });
     console.log(response.data.choices);
    // const encoded = encode(response.data.choices[0].text);
     //console.log('Encoded this string looks like: ', encoded)
    // console.log("Tokens are" + encoded.length);
     // console.log('We can look at each token and what it represents')
     console.log("payload_in " + JSON.stringify(ctx.request.body))
     //var payload_out = { data: response.data.choices[0].text.trim() }
   //  console.log("payload_out " + JSON.stringify(payload_output))
    
   // Insert the original and completed text into the Request entity

    const data = { "data":{
      "payload_in": { prompt: prompt},
      "payload_out": { resp: response.data.choices[0].text.trim() },
      "users_permissions_user" : users_permissions_user
    }
    }
    const request = await strapi.db.query('api::request.request').create(data);

      ctx.send({ data: response.data.choices[0].text.trim()});
    } catch (err) {
      ctx.badRequest('Could not generate response' + err);
      
    }
  }
};

