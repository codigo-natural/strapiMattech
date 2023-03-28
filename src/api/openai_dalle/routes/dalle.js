// Import your custom OpenAI controller
const openai = require('../controller/dalle');
module.exports = {
  routes: [
    {
      method:'POST',
      path: '/openai/dalle',
      handler: openai.generateResponse,
      config: {
        policies: [],
        auth: false
      }
    }
    
  ],
};