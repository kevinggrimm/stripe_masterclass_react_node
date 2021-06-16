import { ProductsContext } from "./ProductsContext";

// Helper function
export const sumItems = cartItems => {
    return {
        // reduce() - Iterate over each item and add quantity
        // Aggregates quantity attributes for all products within cart
        itemCount: cartItems.reduce((total, product) => total + product.quantity, 0),
        // Aggregates item price x quantity for each item in cart
        total: cartItems.reduce((total, product) => total + (product.price * product.quantity), 0)
    };
};

const cartReducer = (state, action) => {
    switch(action.type) {
        case 'ADD_ITEM': 
            // Check if item is in the cart
            if (!state.cartItems.find(item => item.id === action.payload.id)) {
                // Mutate state
                state.cartItems.push({
                    // Spread out payload
                    ...action.payload,
                    // Add quantity property
                    quantity: 1,
                });
            }

            // Return new state
            return {
                // Spread old state
                ...state,
                // Update items that were updated
                cartItems: [...state.cartItems],
                // Update item count + total
                // We can spread out because it is an object
                ...sumItems(state.cartItems)
            };

        case 'INCREASE':
            // findIndex() ==> Return the item whose index matches the payload.id
            const increaseIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
            // Increment the quantity
            state.cartItems[increaseIndex].quantity++;

            return {
                ...state,
                cartItems: [...state.cartItems],
                ...sumItems(state.cartItems),
            };
        
        // Decrement
        case 'DECREASE':
            const decreaseIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
            const product = state.cartItems[decreaseIndex];
            // Decrease if greater than 1
            if (product.quantity > 1) {
                product.quantity--;
            }

            return {
                ...state,
                cartItems: [...state.cartItems],
                ...sumItems(state.cartItems),
            };
        
        // Remove item from the cart
        case 'REMOVE_ITEM':
            // Filter out item being passed in
            const newCartItems = state.cartItems.filter(item => item.id !== action.payload.id);
            return {
                ...state,
                cartItems: [...newCartItems],
                ...sumItems(newCartItems),
            }
        
        // Clear the cart
        case 'CLEAR':
            return {
                cartItems: [],
                itemCount: 0,
                total: 0
            };

        default:
            return state;
    }
};

export default cartReducer;