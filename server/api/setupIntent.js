const stripeAPI = require('../stripe');
const getCustomer = require('../helpers/getCustomer');


async function setupIntent(req, res) {
    // Try to retrieve current user property from request object
    // JWT token is decoded from the frontend
    // Should have one, because we are using validateUser as middleware
    const { currentUser } = req;

    // Pass ID, which is the firebase id attached to the currentUser
    const customer = await getCustomer(currentUser.uid);

    let setupIntent;

    try {
        // Setup payment intent
        setupIntent = await stripeAPI.setupIntents.create({
            customer: customer.id
        });
        res.status(200).json(setupIntent);
    } catch(error) {
        console.log(error);
        res.status(400).json({ error: 'an error occurred, unable to create setup intent' });
    }
}

module.exports = setupIntent;