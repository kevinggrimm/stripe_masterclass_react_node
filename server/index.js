const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const createCheckoutSession = require('./api/checkout');
const webhook = require('./api/webhooks');
const paymentIntent = require('./api/paymentIntent');

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

app.get('/', (req, res) => res.send('Hello World!'));

// Creating endpoint
app.post('/create-checkout-session', createCheckoutSession);

// Adding endpoint for payment intent
app.post('/create-payment-intent', paymentIntent);

// Adding webhook to the server
app.post('/webhook', webhook)


app.listen(port, () => console.log('Server listening on port', port));