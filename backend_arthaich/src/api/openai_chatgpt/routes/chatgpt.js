// Import your custom OpenAI controller
const openai = require('../controller/chatgpt');
module.exports = {
  routes: [
    {
      method:'POST',
      path: '/openai/chatgpt',
      handler: openai.generateResponse,
      config: {
        policies: [],
        auth: false
      }
    }
    
  ],
};