import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Layout from '../../shared/Layout';
import { CartContext } from '../../../context/CartContext';


// useEffect - clears the cart when the component mounts

const Success = ({ history }) => {
    // Pulling from cart context to reset the cart state
    const { clearCart, cartItems } = useContext(CartContext);
    useEffect(() => {
        if (cartItems.length !== 0 ) {
            clearCart()
        }
    }, [clearCart, cartItems]);

    // Customize
    return (
        <Layout>
            <div>
                <h1>Thank you for your order</h1>
                <p>We are currently processing your request</p>
                <div>
                    <button 
                        className='button is-black nomad-btn submit' 
                        onClick={() => history.push('/shop')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default withRouter(Success);