import React, { useState, useEffect, createContext } from 'react';

/*
TODO:
- Swap out APIs with Amplify Authentication
- Functions/calls to listen to authentication change events
- Pushing those into state, etc
*/
import { auth, createUser, createUserProfileDocument  } from '../firebase';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    // Load while the user object is retrieved from DB
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        /*
        - Subscription to onAuthStateChange
        - Return a function to unsubscribe
        - If signed in, you get a user object
        - If not, you get null
        */
        const unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            if (userAuth) {
                const userRef = await createUserProfileDocument(userAuth);

                // Pull userRef created in firebase/index.js
                // Injected into App to get signed in user
                userRef.onSnapshot(snapShot => {
                    setUser({
                        id: snapShot.id,
                        ...snapShot.data()
                    });
                    setLoading(false);
                });
            } else {
                // Set user with whatever it is
                setUser(userAuth);
                // No longer waiting for auth to come back
                setLoading(false);
            }
        });
        
        /*
        - Unsubscribe from onAuthStateChanged to prevent memory leaks
        - whenever the component dismounts or is unmounted
        - prevents memory leaks in your application

        TODO - read more into unsubscribing from Auth in AWSs
        */
       return () => unsubscribeFromAuth();
    }, []);

    // Define the user context
    const userContext = { user, loading};
    
    // Load until data is retrieved
    if (loading) { return <div>Loading...</div> }

    return (
        <UserContext.Provider value={ userContext } >
            {
                children
            }
        </UserContext.Provider>
    );
};

export default UserContextProvider;