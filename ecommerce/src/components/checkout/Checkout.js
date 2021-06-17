import React, { useContext } from 'react';
// Need item count from the cartContext
import { CartContext } from '../../context/CartContext';
import Layout from '../shared/Layout';
import './Checkout.styles.scss';

const Checkout = () => {
    const { itemCount, total } = useContext(CartContext);
    return (
        <Layout>
            <div className='checkout'>
                <h2>Checkout Summary</h2>
                <h3>{`Total Items: ${itemCount}`}</h3>
                <h4>{`Amount to Pay: $${total}`}</h4>
            </div>
        </Layout>
    );
};

export default Checkout;