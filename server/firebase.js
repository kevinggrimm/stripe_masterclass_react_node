// TODO - Apply for Amplify / AWS SDK DynamoDB

const firebaseAdmin = require('firebase-admin');

// Initialize on server. Looks for service account env var
firebaseAdmin.initializeApp();

// Initialize DB
const db = firebaseAdmin.firestore();

// Initialize auth
const auth = firebaseAdmin.auth();

// Exports. Using inside of API endpoints
module.exports = {
    db,
    auth
};