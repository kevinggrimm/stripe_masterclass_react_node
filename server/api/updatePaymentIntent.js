const stripeAPI = require('../stripe');
const getCustomer = require('../helpers/getCustomer');

/*
NOTE - When you create a payment intent, you do not attach a customer to it
- Updates currently existing payment intent
- Associates with a customer

On frontend:
- update existing paymet intent
- when we hit this endpoint, we are providing a payment intent ID
*/
async function updatePaymentIntent(req, res) {
    
    // 
    const { currentUser, body: { paymentIntentId } } = req;

    // Create customer
    const customer = await getCustomer(currentUser.uid);

    let paymentIntent;

    try {
        // 1. Passing the payment intent ID (obtained from req)
        // 2. Pass object - customer we want to associate payment intent with
        paymentIntent = await stripeAPI.paymentIntents.update(
            paymentIntentId,
            { 
                customer: customer.id
            }
        );

        /*
        - Respond to frontend. Send back updated client secret
        - Previously sent back client secret from payment intent
        - Now that payment intent has been updated, we are sending back the 
            updated one that can be used on the frontend to checkout
        */
        res.status(200).json({ clientSecret: paymentIntent.client_secret });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'unable to update payment intent' });
    }
}

module.exports = updatePaymentIntent;