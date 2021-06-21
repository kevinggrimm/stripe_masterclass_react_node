const firebase = require('../firebase');

async function decodeJWT(req, res, next) {
    // Check for auth header and bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        // take ID token and verify we have a valid token
        const idToken = req.headers.authorization.split('Bearer ')[1];

        try {
            // Verify if there is a user in Firebase auth
            const decodedToken = await firebase.auth.verifyIdToken(idToken);
            
            // Attach property, current user, to request object. Set to decoded token
            // Contains user object that we have on the frontend
            req['currentUser'] = decodedToken;
        } catch (error) {
            console.log(error);
        }
    }

    // Calling next because we are using this as middleware
    next();
}

module.exports = decodeJWT;