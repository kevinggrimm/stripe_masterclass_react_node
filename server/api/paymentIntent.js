const stripeAPI = require('../stripe');


function calculateOrderAmount(cartItems) {
    // Multiply by 100 to convert into dollars from cents
    return cartItems.reduce((total, product) => {
        return total + product.price * product.quantity;
    }, 0) * 100;
}

async function paymentIntent(req, res) {
    // Amount, currency, description, payment method types, receipt email
    /*
    - Need to get the cart Items from the front end
    - We could get the amount directly sent to us, but for security reasons,
    we are going to get the cart Items and compute the amount on the backend
    - This is for security reasons so that nobody tampers with the price
    */
   const { cartItems, description, receipt_email, shipping } = req.body;
   let paymentIntent;

   try {
       paymentIntent = await stripeAPI.paymentIntents.create({ 
           amount: calculateOrderAmount(cartItems),
           currency: 'usd',
           description,
           payment_method_types: ['card'],
           receipt_email,
           shipping,
       });

       /* 
        - Want to send a client secret to the frontend
        - Stripe API returns a payment intend object
        - Client secret is needed to complete the payment process
        - Similar concept to the session Id for the hosted checkout

        Lesson 89: 
        - Also returning paymentIntent ID to the frontend
        - Will use this to call updatePaymentIntent when card information is changed
        */
       res.status(200).json({ 
           clientSecret: paymentIntent.client_secret,
           id: paymentIntent.id
        });
   } catch (error) {
       console.log(error);
       res.status(400).json({ error: 'an error occurred, unable to create payment intent' });
   }
}

module.exports = paymentIntent;