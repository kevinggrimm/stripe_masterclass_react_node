import React, { createContext, useState } from 'react';
import SHOP_DATA from '../shop';

// Create product context
export const ProductsContext = createContext();

const ProductsContextProvider = ({ children }) => {
    const [products, setProducts] = useState(SHOP_DATA);

    return (
        <ProductsContext.Provider value={{ products }}>
            {children}
        </ProductsContext.Provider>
    ) 
};

// Export
export default ProductsContextProvider;