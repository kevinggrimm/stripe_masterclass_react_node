const stripeAPI = require('../stripe');

/*
DOCS - https://stripe.com/docs/api/checkout/sessions/create?lang=node
https://stripe.com/docs/payments/accept-a-payment?integration=checkout
1. Domain URL - redirect customer back to your site
*/
async function createCheckoutSession(req, res) {
    // React App URL (currently localhost:3000)
    // In Prod - application that you deployed to
    const domainUrl = process.env.WEB_APP_URL;
    const { line_items, customer_email } = req.body;
    console.log(req.body);
    // Confirm these items were in the body (necessary to perform checkouts)
    if (!line_items || !customer_email) {
        return res.status(400).json({ error: 'missing required session parameters' });
    }

    let session;
    // Try to call
    try {
        session = await stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            customer_email,
            // Creating the Route in the React application
            // Routed back to once payment goes through
            success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domainUrl}/canceled`,
            // Define allowed countries for shipping
            shipping_address_collection: { allowed_countries: ['GB', 'US'] }
        });
        // Pulling off session ID; all that is needed to direct user to Stripe Hosted page
        res.status(200).json({ sessionId: session.id });
    } catch (err) {
        console.log(err);
        // Dont expose error to frontend due to risk of malicious activity
        res.status(400).json({ error: 'an error occured, unable to create session' })
    }
}

module.exports = createCheckoutSession;