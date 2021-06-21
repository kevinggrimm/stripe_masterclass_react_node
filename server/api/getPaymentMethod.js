// Retrieves payment methods for given customer

const stripeAPI = require('../stripe');
const getCustomer = require('../helpers/getCustomer');
const { restart } = require('nodemon');


async function getCards(req, res) {
    /*
    - Pull current user from request object
    - This is the decoded JWT that is obtained from firebased
    - Contains the user object info stored in firebase
    
    - Will be modifying to comply w/ amplify authentication
    */ 
    const { currentUser } = req;
    const customer = await getCustomer(currentUser.uid);

    let cards;

    try {
        // List of payment methods that a user has already saved
        cards = await stripeAPI.paymentMethods.list({
            customer: customer.id,
            type: 'card',
        });
        // Data is an array of payment methods
        res.status(200).json(cards.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'an error occurred, unable to get cards' });
    }
}

module.exports = getCards;