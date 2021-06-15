import React, { useContext } from 'react';
import { ProductsContext } from '../../context/ProductsContext';
import FeaturedProduct from '../shared/FeaturedProduct';

const FeaturedCollection = () => {
    const { products } = useContext(ProductsContext);
    // Only return four products and map into component
    const productItems = products.filter((product, i) => i < 4).map(product => (
        <FeaturedProduct {...product} key={product.id} />
    ));
    return (
        <div className='featured-collection container'>
            <h2 className='featured-section-title'>Featured Collection</h2>
            <div classname='products'>
                {
                    productItems
                }
            </div>
        </div>
    );
};

export default FeaturedCollection;