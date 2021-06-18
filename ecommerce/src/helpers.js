
// Find the item in the cart items
export const isInCart = (product, cartItems) => {
    // Iterates over items, checks the ID. Returns true if one match, else undefined
    return cartItems.find(item => item.id === product.id);
};

// This will be our website URL
// const API = 'https://localhost:8080';
const API = 'http://localhost:8080';

// 
export async function fetchFromAPI(endpoint, opts) {
    const { method, body } = { method: 'POST', body: null, ...opts };

    /* 
    - Await a call to fetch (would be using Amplify to call)
    - Creates a session from the stripe backend
    - Redirects to stripe checkout page
    */
    const res = await fetch(`${API}/${endpoint}`, {
        method, 
        ...(body && { body: JSON.stringify(body) }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return res.json();
}