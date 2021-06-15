import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { ProductsContext } from '../../context/ProductsContext';
import Layout from '../../components/shared/Layout';
import './SingleProduct.styles.scss';

// Get root param
// Check if product is in the products context
const SingleProduct = ({ match, history: { push } }) => {
    const { products } = useContext(ProductsContext);
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
                        <button className='button is-white nomad-btn' id='btn-white-outline'>
                            ADD TO CART
                        </button>
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