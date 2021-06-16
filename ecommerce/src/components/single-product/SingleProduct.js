import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { ProductsContext } from '../../context/ProductsContext';
import { isInCart } from '../../helpers';
import { CartContext } from '../../context/CartContext';
import Layout from '../../components/shared/Layout';
import './SingleProduct.styles.scss';

// Get root param
// Check if product is in the products context
const SingleProduct = ({ match, history: { push } }) => {
    const { products } = useContext(ProductsContext);
    const { addProduct, increase, cartItems } = useContext(CartContext);
    const { id } = match.params;
    const [ product, setProduct ] = useState(null);

    // Check if ID from products matches param
    // Using the .find() method to search for match
    useEffect(() => {
        // Returned in the item if found
        const product = products.find(item => Number(item.id) === Number(id))
        
        // Redirect if not found
        if (!product) {
            return push('/shop');
        }
        
        setProduct(product);

    }, [id, product, push, products]);

    // Add a loading component until a component is found
    if (!product) {
        return null
    };

    const { imageUrl, title, price, description } = product;
    // Calling function once - optimization - instead of twice below
    const itemInCart = isInCart(product, cartItems);

    return (
        <Layout>
            <div className='single-product-container'>
                <div className='product-image'>
                    <img src={imageUrl} atl='' />
                </div>
                <div className='product-details'>
                    <div className='name-price'>
                        <h3>{title}</h3>
                        <p>{price}</p>
                    </div>
                    <div className='add-to-cart-btns'>
                        {
                            !itemInCart &&
                            <button 
                                className='button is-white nomad-btn' 
                                id='btn-white-outline'
                                onClick={() => addProduct(product)}>
                                ADD TO CART
                            </button>
                        }
                        {
                            itemInCart &&
                            <button 
                                className='button is-white nomad-btn' 
                                id='btn-white-outline'
                                onClick={() => increase(product)}>
                                ADD MORE
                            </button>

                        }
                        <button className='button is-black nomad-btn' id='btn-black-outline'>
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                    <div className='product-description'>
                        <p>
                            { description }
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

// Wrap in withRouter HOC
export default withRouter(SingleProduct);