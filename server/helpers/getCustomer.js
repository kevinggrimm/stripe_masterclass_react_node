/*
- Retrieve customer
- If not exists, create customer
- Return customer ID

TODO - Update for Amplify
*/

const stripeAPI = require('../stripe');
const firebase = require('../firebase');


async function createCustomer(userId) {
    // 1. Get user snapshot
    const userSnapshot = await firebase.db.collection('users').doc(userId).get();
    
    // 2. Pull off email of user that returns
    const { email } = userSnapshot.data();

    // 3. Create user in Stripe
    // https://stripe.com/docs/api/customers/create
    const customer = await stripeAPI.customers.create({
        email, 
        // Metadata - link firebase ID to customer in stripe
        // TODO - Do the same for dynamo
        metadata: {
            firebaseUID: userId
        }
    });

    // Add new property to firebase object, customerId
    // Customer that comes back from stripe is an object
    // Setting this in the users collection for that user
    // TODO - Configure function for dynamoDB
    await userSnapshot.ref.update({ stripeCustomerId: customer.id });
    
    return customer;
}

// Retrieve customer from stripe
async function getCustomer(userId) {
    const userSnapshot = await firebase.db.collection('users').doc(userId).get();
    
    // Pull of stripe customerID
    const { stripeCustomerId } = userSnapshot.data();

    // If no ID, return createCustomer and pass the UserId 
    if (!stripeCustomerId) {
        return createCustomer(userId);
    }

    // If customer exists, await call to Stripe API to retrieve customer details
    customer = await stripeAPI.customers.retrieve(stripeCustomerId);
    return customer;
}

// Exports
module.exports = getCustomer;