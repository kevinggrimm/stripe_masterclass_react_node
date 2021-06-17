const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const createCheckoutSession = require('./api/checkout');

// Initialize App
const app = express();
const port = 8080;

// Middleware
app.use(express.json());

// CORS Module - so App can send requests to server
// NOTE - Going to use Lambdas
app.use(cors({ origin: true }));

app.get('/', (req, res) => res.send('Hello World!'));

// Creating endpoint
app.post('/create-checkout-session', createCheckoutSession);

app.listen(port, () => console.log('Server listening on port', port));