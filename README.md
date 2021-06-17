# Resources
- **Postman:** https://web.postman.co/workspace/New-Personal-Workspace~053bc16e-962e-4529-a973-e9d80f385c69/request/create?requestId=b2d20c61-b8b1-407e-ae0d-d231b303c5f3
- **Stripe Docs**

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