import React, { useContext, useState  } from 'react';
// Need item count from the cartContext
import { CartContext } from '../../context/CartContext';
import Layout from '../shared/Layout';
import StripeCheckout from './stripe-checkout/StripeCheckout';
import CustomCheckout from '../custom-checkout/CustomCheckout';
import ShippingAddress from '../custom-checkout/ShippingAddress';
import './Checkout.styles.scss';

const Checkout = () => {
    const { itemCount, total, cartItems } = useContext(CartContext);
    // Shipping address + name of customer
    const [ shipping, setShipping ] = useState(null);
    // Inline styles for the Shipping Address component
    const addressShown = {
        // Based on whether address is filled out
        display: (shipping ? 'none' : 'block')
    }
    // Style prop for the custom checkout component
    // Only show if the shipping is present
    const cardShown = {
        display: (shipping ? 'block' : 'none')
    }
    return (
        <Layout>
            <div className='checkout'>
                <h2>Checkout Summary</h2>
                <h3>{`Total Items: ${itemCount}`}</h3>
                <h4>{`Amount to Pay: $${total}`}</h4>
                {/* <StripeCheckout /> */}
                {/* 
                    Wrapper for shipping component 
                    Only show if not entered already
                */}
                <div style={addressShown}>
                    {/* 
                        Passed as prop to shipping
                        State passed to component
                        Submission will update the styles
                    */}
                    <ShippingAddress setShipping={setShipping} />
                    {/* 
                        When user fills out information, show
                        the custom checkuot component where they
                        can fill out the card information
                    */}
                </div>
                <div style={cardShown}>
                    {/* Only show if we have a shipping address */}
                    <CustomCheckout 
                        shipping={shipping}
                        cartItems={cartItems}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Checkout;