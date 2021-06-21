import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

import { UserContext } from '../../context/user-context';
import { fetchFromAPI } from '../../helpers';

/*
    shipping - submitting to backend
    cartItems - used to calculate amount
    history - route user to success page

    Calling endpoint as soon as the Component mounts w/ useEffect
*/
const CustomCheckout = ({ shipping, cartItems, history: { push }}) => {
    // Pull off user
    const { user } = useContext(UserContext);
    const [ processing, setProcessing ] = useState(false);
    const [ error, setError ] = useState(null);
    // Captures the clientSecret retrieved from the backend
    const [ clientSecret, setClientSecret ] = useState(null);
    const [ cards, setCards ] = useState(null);
    // Updated when the user selects a payment card from the dropdown list
    const [ paymentCard, setPaymentCard ] = useState('');
    // Initially do not save the card
    const [ saveCard, setSavedCard ] = useState(false);
    // Copy of stripe object
    const [ paymentIntentId, setPaymentIntentId ] = useState(null);
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        /* 
            - Calls backend (payment-intent); returns client secret
            - Need a shipping address, or payment intent cannot be setup
            - Shipping is originally set as null
            - Also need price, quantity for cartItems

        Lesson 91:
        - If we have a shipping address, call backend and make a payment intent
            - Part of params for setting up payment intent
        - Check if we have a signed in user
            - Try to hit get payment methods endpoint
            - Get cards that are saved in account
        */
        const items = cartItems.map(item => ({price: item.price, quantity: item.quantity}));

        // Check for user. Need to get user from UserContext
        if (user) {
            // Make request to getPayments endpoint
            // async functions required in useEffect
            const savedCards = async () => {
                try {
                    // Call backend endpoint helper
                    // TODO - update for AWS
                    const cardsList = await fetchFromAPI('get-payment-methods', {
                        method: 'GET',
                    });
                    // Set state. Need a state for the cards
                    setCards(cardsList);
                } catch (error) {
                    // Log error
                    // TODO - Configure sentry
                    console.log(error);
                }
            }
            // Execute the function
            savedCards();
        }

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
                // Lesson 95 - Need to also pull off the ID property
                // backend function is 
                const { clientSecret, id } = await fetchFromAPI('create-payment-intent', {
                    body
                });

                // Set the client secret state
                setClientSecret(clientSecret);
                // Set the payment intent id
                setPaymentIntentId(id);
            }

            // Call async function in useEffect
            customCheckout();
        }
        // Add dependencies
    }, [shipping, cartItems, user]);

    const handleCheckout = async () => {
        setProcessing(true);

        let si; // setup intent
        /*
            1. Check if user has selected to save card
            2. Make request to a setup intent
        */
        if (saveCard) {
            // post endpoint without a body
            // setup intent will then be used after user finishes making payment
            si = await fetchFromAPI('save-payment-method');
        }

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
            /*
                Lesson 93:
                1. Check for saved card
                2. Check for payment intent
            */
            if (saveCard && si) {
                // send the customers card details to be saved with Stripe
                // 1. first param - client secret
                await stripe.confirmCardSetup(si.client_secret, {
                    payment_method: {
                        // 2. payment method we want to save
                        // saving to stripe account connected to user
                        card: elements.getElement(CardNumberElement)
                    }
                });
                // Payment succeeded; redirect to success page
                push('/success');
            } else {
                // Payment succeeded; redirect to success page
                push('/success');                
            }
        }
    };

    /*
        1. Make a call to backend to update payment intent
        - We already have a payment intent, just updating that
        - Supplying a customer ID to the payment intent
        - Also supply payment intent ID to update

        2. Wait for response
        - Upon return, pull back client secret
        
        3. Confirm card payment
        - Supply payment method, which is the payment card
        - PaymentCard is the ID
        - Value for each card is the card ID, which is the ID for that payment method
    */
    const savedcardCheckout = async () => {
        setProcessing(true); // disable buttons

        // update payment intent to include the customer parameter
        const { clientSecret } = await fetchFromAPI('update-payment-intent', {
            // 1. body is payment intent ID
            body: { paymentIntentId }, method: 'PUT'
        });

        // Try to confirm the payment
        // https://stripe.com/docs/js/payment_intents
        // payment_method accepts the ID of an existing PaymentMethod
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentCard, // contains the ID that comes back
        });

        if (payload.error) {
            setError(`Payment Failed: ${payload.error.message}`);
            setProcessing(false);
        } else {
            // Route user to success page
            push('/success');
        }

    }

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

    /*
    Lesson 91: 
    - Component to select the saved cards
    */
    let cardOption;

    if (cards) {
        cardOption = cards.map(card => {
            // 1. Pull of brand, last4, expiry month
            // Params come from Stripe documentation
            const { card: { brand, last4, exp_month, exp_year } } = card;
            // 2. Return JSX
            return (
                <option key={card.id} value={card.id}>
                    { `${brand}/ **** **** **** ${last4} ${exp_month}/${exp_year}` }
                </option>
            );
        });
        /*
        TIP - Add another option so that we give the user to select a card
        - Give the user an option to select a card
        - Makes sure that nothign in unselected
        - Can have the first option selected, but nothing is showing up
        - Optional selection that the user can see
        */
        cardOption.unshift(
            <option key='Select a card' value=''>
                Select A Card
            </option>
        );
    }


    return (
        <div>
            {
                /*
                    1. Check for user signed in 
                    2. Check for cards
                    3. Check for at least one card
                */
                user && (cards && cards.length > 0) && 
                <div>
                    <h4>Pay with saved card</h4>
                    {/* 
                        - Value is default card 
                        - Need to create a state - paymentCard

                        setPaymentCard - value becomes a 'card.id' from the `cardOptions`
                    */}
                    <select value={paymentCard} onChange={e => setPaymentCard(e.target.value)}>
                        { cardOption }
                    </select>
                    <button
                        type='submit'
                        // disable button if there is no payment card
                        disabled={processing || !paymentCard }
                        className='button is-black nomad-btn submit saved-card-btn'
                        // Create a handler if user makes payment for saved card
                        onClick={() => savedcardCheckout()}
                    >
                        {/*  */}
                        { processing ? 'PROCESSING' : 'PAY WITH SAVED CARD' }
                    </button>
                </div>
            }
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
            {/* 
                LESSON 93:
                - Check that user is signed in 
                - Only give option if signed in
                - Update with checked value

                => Now need to add logic for setting up payment intent
                - Configured in handleCheckout function
            */}
            {
                user && 
                <div className='save-card'>
                    <label>Save Card</label>
                    <input
                        type='checkbox'
                        checked={saveCard} // Boolean value
                        onChange={e => setSavedCard(e.target.checked)}
                    />
                </div>
            }
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