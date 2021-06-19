# Resources
1. **Postman:** https://web.postman.co/workspace/New-Personal-Workspace~053bc16e-962e-4529-a973-e9d80f385c69/request/create?requestId=b2d20c61-b8b1-407e-ae0d-d231b303c5f3
2. **Stripe Docs**
https://stripe.com/docs/stripe-js/react


## Test Checkout Session Endpoint
- `localhost:8080/create-checkout-session`
```json
{
    
    "customer_email": "kg@gmail.com"
}
```

## Successful Payments
- Need to get notified when customer makes payments. Part of fulfilling order.
- Need an automated way to be notified - this is where **webhooks** are used
- "Phone number that stripe calls to notify you of activity in your account"
- Endpoint that is used for notifications.
- Event object with type of event and related data
- Uses the event details to take any required actions
    - Fulfill order, payment could not be taken, etc.
- Should delay order fulfillment until funds are available in your account
- After payment succeeded, you can fulfill the order

## Webhooks
- Modifying endpoint to ensure we get the raw offer as a request object
- Because it is publicly available, anyone can send data to it
- We need to know that the event came from Stripe
- Doing security setup - modifying request object. Attaching raw buffer to request object.
- Stripe provides **CLI Tool** to forward events to local host tool 

## Stripe CLI
- Forwarding events to endpoint/server on localhost
- Creating an endpoint, *Webhook*
- `stripe listen --forward-to http://localhost:8080/webhook`
- This will initialize the stripe CLI; returns a *webhook signing secret*
- In `server` folder, assign the webhook signing secret as an env variable
    - **NOTE:** Will do this in serverless backend
    - Valid for ~80 days

## Setting up Webhook Endpoint
- Used to process the event that comes from Stripe
- After the webhook function is setup, we can then test the integration on our frontend
- The event output is displayed in the terminal, saved as *webhook_output.js*
- Would then:
    1. Send an email to the customer, sending a receipt or confirmation email
    2. Call your database backend to save the order to your DB
- **Note:** This same data is available in the Payments section under **Events and logs**
- Can do further steps on webhook to fulfill the order

# New Section - Stripe Custom Checkout Process 
## Overview
- Everything is hosted on your application; no redirecting on Stripe
- Stripe has React components specifically for this
    - *Iframes* that are hosted on Stripe's service
- Can customize stripe components
    - Take a `style` prop to add custom colors, font sizes
### Process for Accepting Payments with Custom Checkout
1. Make a request to set up a payment intent
2. Create a payment intent with the Stripe API
3. Stripe API returns payment intent, which includes client secret
4. Frontend completes the payment process with the client secret
5. Stripe confirms the payment status, whether it failed or was successful

## Create Payment Intent Endpoint
**Docs:** 
- https://stripe.com/docs/api/payment_intents
- https://stripe.com/docs/payments/payment-intents


## Testing in Postman
- Create a new `POST` endpoint in the postman account
- Set URL to `localhost:8080/create-payment-intent`
- Body: raw + JSON
```json
{
    "cartItems": [
        {
            "price": 35,
            "quantity": 1
        },
        {
            "price": 28,
            "quantity": 1
        }
    ],
    "shipping": {
        "name": "John Smith",
        "address": {
            "line1": "10 downing street, London"
        }
    },
    "description": "payment intent for cart items",
    "receipt_email": "kg@gmail.com"
}
```

## 69 - Shipping Address Component
`import { Formik } from 'formik';`
1. Components for:
- Shipping address
- Custom checkout

## 71 - Building Custom Checkout Component
- React Stripe Docs - https://stripe.com/docs/stripe-js/react


# Section 6 - Setup Authentication
## Overview
- Customers sign into app and checkout as guests
- In most cases, need to be authenticated and have an account
- Need to be authenticated to save the payment details
- **Payment details are stored on Stripe and retrieved via API**

## 79 - Create User Context
- Needed to get an object that contains the signed in user
- Subscribed to firebase `onAuthChange`
- Context file in `context` folder called `user-context.js`



## Modules
- bulma
- node-saas



### Lessons
29: Test Add Product Feature
- Flow of data with React Context

### Payment Gateway
- System that takes care of payments
- Securely accessing payment methods
- Applying charges on your behalf
**Pros:**
- PCI Compliance
- Encrypt credit card data
- Store credit card data securely

**Stripe**
- One off payments
- Recurring payments
- Save credit cards
- Dynamic charges based on usage
- UI components to integrate into App

## Customers
- Active subscriptions

## Products
- Products + Pricing structure for what you charge
- Can be recurring, one-time charges
- Subscriptions, invoices, checkouts

## Reports
- Breakdown of balance changes over time

## Developer
- *SK:* Interact with stripe API
- *Restricted Key:* Limits access and permissions for different areas of account
- **CLI:** Forward webhook events

### Webhooks
- Notify application when an event happens in your account
- Customer's bank confirms payment
- Customer disputes a charge
- Recurring payment succeeds

## Settings
- Business settings: How frequently and when you are paid

# Stripe Payment Flow
- Backend to communicate with API and establish **payment intents**
- Cannot be initiated via frontend
- Webhooks cannot be sent to frontend
## General Flow
- Payments through backend
- Makes a request by (1) creating session (2) payment intent
- Stripe returns (1) session ID or (2) client secret
- This is what is used to complete the purchase

# Lesson - Node Setup
## Main Deps
- `npm init -y`
- `npm install express stripe cors`
## Dev Dependencies
- `npm i -D dotenv nodemon`

# Stripe Checkout
- Handles all UI
- Quickest way to accept payments
- Limited in customization
- Entire checkout page is hosted on Stripe
- Want to use custom checkout for more control

# Hosted Checkout Process
- Customer selects items that they want to buy; clicks on checkout
- Initiates a request t the backend to create a checkout session
- On backend, session is created via Stripe
- Stripe API responds with a **session object**
- **sessionID** property is sent to the front end app
- Redirects user to the hosted checkout page

# Create Stripe Object on the Server
- https://stripe.com/docs/api/checkout/sessions/create
- To setup checkout, need items from the request object
    - Line items array list - aray of items to purchase
    - Customers email
- Create a Stripe API object


# Frontend installations
1. `npm i @stripe/react-stripe-js @stripe/stripe-js`
2. Add PK as environment variable in *.env* file
3. Initiate Stripe library on React app in `index.js`
- Import Stripe elements
- Import `loadStripe` function
4. Wrap `App` with `Elements` component
- Pass a prop to the **Elements**
- `stripe` prop, passing the `stripePromise`
- Now have the Stripe object in any component inside our app
5. Add a Route for the `Checkout` component in App.js

# Stripe Checkout Component
- Button to take the user to the Stripe hosted page
1. Create a helper function to send requests to the backend
- Found in `helpers.js`
- **NOTE:** Will be using API Gateway + Serverless here