import { auth } from './firebase';


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
    
    // Get current signed in user
    // TODO - Do for DynamoDB
    const user = auth.currentUser;
    const token = user && (await user.getIdToken());
    
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
            // Add authorization header
            // TODO - Add DDB auth header
            Authorization: `Bearer ${token}`
        },
    });

    // Check if status is 200
    if (res.status === 200) {
        return res.json();
    } else {
        throw new Error(res.statusText);
    }
}