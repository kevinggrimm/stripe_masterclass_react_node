const stripeAPI = require('stripe')(process.env.SECRET_KEY);


// Export - can now import elsewhere and use to call the Stripe service
module.exports = stripeAPI;