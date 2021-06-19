import firebase from 'firebase/app';
import 'firebase/firestore'; // for the db
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyBdedOyz-MZ2D9c2Y8b8H2S2LVho5q1RNU",
    authDomain: "quickstart-1572988350955.firebaseapp.com",
    projectId: "quickstart-1572988350955",
    storageBucket: "quickstart-1572988350955.appspot.com",
    messagingSenderId: "211071409464",
    appId: "1:211071409464:web:c9bd106612c9a7fbe7f5cd"
};

firebase.initializeApp(config);

const firestore = firebase.firestore();
const auth = firebase.auth();

const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) { return }

    /*
    - Goes under the users collection
    - Each user has their own document
    - In DynamoDB, this would be an item
    */
    const userRef = firestore.doc(`users/${userAuth.uid}`)
    const snapShot = await userRef.get();

    /*
    - Create a profile if one does not exist
    - DynamoDB - conditional expression
    */
    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        
        // Call DB again and create
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            });
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
}

// Note - for AWS these are the Amplify API handlers
export {
    firestore,
    createUserProfileDocument,
    /*
      NOTE - Authentication
      - Needed for signing up, in out
      - Create a subscription to the firebase auth
      - Implement listener to update app when user signs in
      
      - Creating user context to pass down to components that
      need to use it

      ==> 
    */
    auth
}