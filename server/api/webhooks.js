const stripeAPI = require('../stripe');

// Object to handle webhook types
const webHookHandlers = {
    'checkout.session.completed': (data) => {
        console.log('Checkout completed successfully ', data);
        // Other business logic
            // Write to DB
            // email user
            // Connect to 3rd party fulfillment service
    },

    'payment_intent.created': (data) => {
        console.log('Payment intent created ', data);
    },
    
    'payment_intent.succeeded': (data) => {
        console.log('Payment succeeded ', data);
    },

    'payment_intent.failed': (data) => {
        console.log('Payment failed ', data);
    }
}


function webhook(req, res) {
    // Pull stripe signature from req.headers
    // Docs - https://stripe.com/docs/webhooks/signatures
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeAPI.webhooks.constructEvent(
            // 1. Raw body buffer attached to request object
            req['rawBody'],
            // 2. Signature from stripe in headers
            sig,
            // 3. Env varible for webhook secret
            process.env.WEB_HOOK_SECRET
        );
    } catch (error) {
        // For when events did not come from Stripe
        return res.status(400).send(`Webhook error ${error.message}`);
    }

    /*
        TIP - you dont want to listen to all of the events that Stripe sends
        - Puts extra load on your server 
        - Will be using Lambda though still, non priority logic + features

        Executing the function associated with the event type
    */
    if (webHookHandlers[event.type]) {
        webHookHandlers[event.type](event.data.object);
    }
}

module.exports = webhook;