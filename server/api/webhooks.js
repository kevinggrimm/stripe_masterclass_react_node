const stripeAPI = require('../stripe');

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

    // If event did come from Stripe, listen for checkout.Session.completion event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Event data: ', session);
    }
}

module.exports = webhook;