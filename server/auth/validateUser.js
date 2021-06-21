
/*
- Checks for current user property in the validateJWT function
- If not found, send a response that is 401 unauthorized
*/
function validateUser(req, res, next) {
    const user = req['currentUser'];
    if (!user) {
        // Unauthorized
        return res.status(401).send();
    }

    // Need to call next to continue w/ pipeline
    next();
}

module.exports = validateUser;