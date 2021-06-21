const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });

// Functions to interact w/ stripe API
const createCheckoutSession = require('./api/checkout');
const decodeJWT = require('./auth/decodeJWT');
const getCards = require('./api/getPaymentMethod');
const paymentIntent = require('./api/paymentIntent');
const setupIntent = require('./api/setupIntent');
const updatePaymentIntent = require('./api/updatePaymentIntent');
const webhook = require('./api/webhooks');

// Middleware for protected routes
const validateUser = require('./auth/validateUser');

/*
- Going to create protected endpoints that required an authorized user
- This is where the validateUser middleware will come in handy
- Will be used before the function handler
*/

// Initialize App
const app = express();
const port = 8080;

// Attaching the raw buffer to the request object
// 
app.use(express.json({
    verify: (req, res, buffer) => req['rawBody'] = buffer,
}))

// Middleware
app.use(express.json());

// CORS Module - so App can send requests to server
// NOTE - Going to use Lambdas
app.use(cors({ origin: true }));

// now have decode function
app.use(decodeJWT);

app.get('/', (req, res) => res.send('Hello World!'));

// Creating endpoint
app.post('/create-checkout-session', createCheckoutSession);

// Adding endpoint for payment intent
app.post('/create-payment-intent', paymentIntent);

// User has to be signed in. Place validateUser in front
app.post('/save-payment-method', validateUser, setupIntent);

// Create an endpoint for getCards
app.get('/get-payment-methods', validateUser, getCards);

// Put endpoint to update payment intent
app.put('/update-payment-intent', validateUser, updatePaymentIntent);

// Adding webhook to the server
app.post('/webhook', webhook)

app.listen(port, () => console.log('Server listening on port', port));