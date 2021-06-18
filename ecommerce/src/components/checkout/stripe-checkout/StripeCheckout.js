import React, { useState, useContext } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { CartContext } from '../../../context/CartContext';
import { fetchFromAPI } from '../../../helpers';

const StripeCheckout = () => {
    const [ email, setEmail ] = useState('');
    const { cartItems } = useContext(CartContext);
    // Initialize Stripe to communicate w/ Stripe servers
    const stripe = useStripe();
    // Create line items, email from customer
    // Redirect to Stripe page
    const handleGuestCheckout = async (e) => {
        e.preventDefault();
        
        // Return an object aligning w/ line_items Docs in stripe
        const line_items = cartItems.map(item => {
            return {
                quantity: item.quantity,
                price_data: {
                    currency: 'usd',
                    unit_amount: item.price * 100, // amount is in cents
                    // Displays item information to the user
                    product_data: {
                        name: item.title,
                        description: item.description,
                        images: [item.imageUrl],// displayed to user
                    }
                }
            }
        });

        // Create checkout session by calling endpoint
        const response = await fetchFromAPI('create-checkout-session', {
            body: { line_items, customer_email: email },
        });

        const { sessionId } = response;
        // Either get an error or a success
        // Redirect user to checkout page w/ sessionId
        const { error } = await stripe.redirectToCheckout({
            sessionId
        });

        if (error) {
            console.log(error); 
            // Can also show a message to user
        }
    };


    return (
        <form onSubmit={handleGuestCheckout}>
            <div>
                <input
                    type='email'
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Email'
                    value={email}
                    className='nomad-input'
                />
            </div>
            <div className='submit-btn'>
                <button type='submit' className='button is-black nomad-btn submit'>
                    Checkout
                </button>
            </div>
        </form>
    );
};

export default StripeCheckout;