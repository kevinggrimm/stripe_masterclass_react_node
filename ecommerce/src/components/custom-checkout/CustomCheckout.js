import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

import { fetchFromAPI } from '../../helpers';

/*
    shipping - submitting to backend
    cartItems - used to calculate amount
    history - route user to success page

    Calling endpoint as soon as the Component mounts w/ useEffect
*/
const CustomCheckout = ({ shipping, cartItems, history: { push }}) => {
    const [ processing, setProcessing ] = useState(false);
    const [ error, setError ] = useState(null);
    // Captures the clientSecret retrieved from the backend
    const [ clientSecret, setClientSecret ] = useState(null);
    // Copy of stripe object
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        /* 
            - Calls backend (payment-intent); returns client secret
            - Need a shipping address, or payment intent cannot be setup
            - Shipping is originally set as null
            - Also need price, quantity for cartItems
        */
        const items = cartItems.map(item => ({price: item.price, quantity: item.quantity}));
        if (shipping) {
            const body = {
                cartItems: items,
                shipping: {
                    name: shipping.name,
                    address: {
                        line1: shipping.address
                    }
                },
                description: 'payment intent for nomad shop',
                receipt_email: shipping.email,
            }

            // Make call to backend create-payment-intent API
            const customCheckout = async () => {
                const { clientSecret } = await fetchFromAPI('create-payment-intent', {
                    body
                });

                // Set the client secret state
                setClientSecret(clientSecret)
            }

            // Call async function in useEffect
            customCheckout();
        }
        // Add dependencies
    }, [shipping, cartItems]);

    const handleCheckout = async () => {
        setProcessing(true);
        // 1. Call confirmCardPayment; pass clientSecret
        const payload = await stripe.confirmCardPayment(clientSecret, {
            // 2. Supply object with payment method
            payment_method: {
                // 3. User card is extracted using the elements hook
                // 4. Specify the CardNumberElement pulled from module
                card: elements.getElement(CardNumberElement)
            }
        });

        // Payload returns an error if there is one. Success returns nothing
        if (payload.error) {
            setError(`Payment Failed: ${payload.error.message}`);
        } else {
            // Payment succeeded; redirect to success page
            push('/success');
        }
    };

    // https://stripe.com/docs/js/element/events/on_change?type=cardElement#element_on_change-handler
    const cardHandleChange = (event) => {
        const { error } = event;
        setError(error ? error.message : '');
    }

    const cardStyle = {
        style: {
            base: {
                color: '#424770',
                fontFamily: 'Roboto, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: '16px',
                '::placeholder': {
                    color: '#606060',
                },
            },
            invalid: {
                color: '#9e2146',
                iconColor: "#fa755a"
            },
        },
    };


    return (
        <div>
            <h4>Enter payment details</h4>
            {/* 
                Each card element has a container 
                All use the same class, onChange
            */}
            <div className='stripe-card'>
                <CardNumberElement 
                    className='card-element'
                    options={cardStyle}
                    onChange={cardHandleChange}
                />
            </div>
            <div className='stripe-card'>
                <CardExpiryElement 
                    className='card-element'
                    options={cardStyle}
                    onChange={cardHandleChange}
                />
            </div>
            <div className='stripe-card'>
                <CardCvcElement 
                    className='card-element'
                    options={cardStyle}
                    onChange={cardHandleChange}
                />
            </div>
            <div className='submit-btn'>
                <button
                    disabled={processing}
                    className='button is-black nomad-btn submit'
                    onClick={() => handleCheckout()}
                >
                    {
                        processing ? 'PROCESSING' : 'PAY'
                    }
                </button>
            </div>
            {
                error && (<p className='error-message'>{error}</p>)
            }
        </div>
    );
};

export default withRouter(CustomCheckout);