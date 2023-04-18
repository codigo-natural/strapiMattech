// Import your custom OpenAI controller
const payment_intent = require('../controller/payment');
module.exports = {
  routes: [
    {
      method:'POST',
      path: '/payment/create-payment-intent',
      handler: payment_intent.createPaymentIntent,
    },
    {
        method:'GET',
        path:'/payment/retrieve/:paymentIntentId',
        handler:payment_intent.retrievePaymentIntent
    },
    {
        method:'POST',
        path:'/payment/createSubscription',
        handler:payment_intent.createSubscription
    },
    {
      method:'POST',
      path:'/payment/createUser',
      handler:payment_intent.createUser
  }
    
  ],
};