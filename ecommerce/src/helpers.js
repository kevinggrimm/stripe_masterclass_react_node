
// Find the item in the cart items
export const isInCart = (product, cartItems) => {
    // Iterates over items, checks the ID. Returns true if one match, else undefined
    return cartItems.find(item => item.id === product.id);
};

