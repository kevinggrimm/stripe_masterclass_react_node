import React, { useContext } from 'react';
import { CartContext } from '../../../context/CartContext';
import Layout from '../../shared/Layout';
import CartItem from './CartItem';
import Total from './Total';
import './CartPage.styles.scss';

const CartPage = () => {
    const { cartItems, itemCount, total, increase, decrease, removeProduct, clearCart } = useContext(CartContext);
    // Pass down to CartItem
    const funcs = { increase, decrease, removeProduct };
    return (
        <Layout>
            <>
                <h1>Cart</h1>
                {/* Check item count in cart; if nothing, display a message */}
                {
                    cartItems.length === 0 
                        ? <div className='empty-cart'>Your cart is empty.</div> 
                        :
                        <>
                            <div className='cart-page'>
                                <div className='cart-item-container'>
                                    {
                                        // Spread the item into the CartItem
                                        // Props are destructured within the Component
                                        cartItems.map(item => <CartItem { ...item } key={item.id} {...funcs} /> )
                                    }
                                </div>
                                <Total itemCount={itemCount} total={total} clearCart={clearCart} />
                            </div>
                        </>
                }
            </>
        </Layout>
    );
};

export default CartPage;