import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ProductsContextProvider from './context/ProductsContext';
import CartContextProvider from './context/CartContext';
import UserContextProvider from './context/user-context';
// Import Stripe dependencies
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';

// Instantiate Stripe promise; call loadStripe function, passing Stripe PK
const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);


// Strict mode calls action created twice
ReactDOM.render(
  <Router>
    <ProductsContextProvider>
      <CartContextProvider>
        {/* useStripe allows us to use the Stripe API in our app */}
        <Elements stripe={stripePromise}>
          {/* Wrap application with usercontextprovider */}
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </Elements>
      </CartContextProvider>
    </ProductsContextProvider>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
