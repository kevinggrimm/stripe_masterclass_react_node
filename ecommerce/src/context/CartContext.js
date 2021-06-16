import React, { createContext, useReducer } from 'react';
import cartReducer from "./cartReducer";

export const CartContext = createContext();

const initialState = {
    cartItems: [],
    itemCount: 0,
    total: 0
};

const CartContextProvider = ({ children }) => {
    /*
    - First argument: reducer function
    - Second argument: initial state
    
    Returns: State, dispatch function
    - dispatch function is used for add, remove, increase items etc
    - Runs action through cart reducer
    */
    const [state, dispatch] = useReducer(cartReducer, initialState);
    
    // Action creator; passed down via context
    // Any component that reaches down can access the method
    // Reducer must listen to the action type
    const addProduct = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
    const increase = (product) => dispatch({ type: 'INCREASE', payload: product });
    const decrease = (product) => dispatch({ type: 'DECREASE', payload: product });
    const removeProduct = (product) => dispatch({ type: 'REMOVE_ITEM', payload: product });
    const clearCart = () => dispatch({ type: 'CLEAR' });
    const contextValues = {
        ...state,
        addProduct,
        increase,
        decrease,
        removeProduct,
        clearCart,
    };

    return (
        <CartContext.Provider value={ contextValues }>
            {
                children
            }
        </CartContext.Provider>
    );
};

export default CartContextProvider;
