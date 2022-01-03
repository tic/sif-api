// Load the configuration file
const { config } = require("./config");


// Import the default responses
const responses = require("../endpoints/responses");


// Initialize the CognitoExpress object
const CognitoExpress = new (require("cognito-express"))({
    region: config.COGNITO_REGION,
    cognitoUserPoolId: `${config.COGNITO_REGION}_${config.COGNITO_POOLID}`,
    tokenUse: "id",
    tokenExpiration: 3600000,
});


// The authentication function
exports.authenticate = (req, res, next) => {
    try {
        // If there are no provided headers, immediately deny
        // the request
        if (!req.headers) {
            res.status(401).send(responses.response401);
            return;
        }

        // Parse the authorization token from request headers
        // If the uppercase version of the header isn't there,
        // we optionally select the lowercase version.
        var authHeader = req.headers["Authorization"] || req.headers["authorization"];

        // Attempt to validate the token
        CognitoExpress.validate(authHeader, (err, authenticatedUser) => {

            // If the user is invalid
            if (!authenticatedUser) {
                res.status(401).send(responses.response401);
                return;
            }

            // If there was an error, send the default
            // internal server error response
            if (err) {
                console.error("Caught authentication error\n%s", err);
                res.status(500).send(responses.response500);
            } 

            // Parse the username out of the verified user data
            // ID tokens provide the username under the "cognito:username"
            // key, while access tokens provide it under the "username"
            // key. While ID tokens are specified in the initialization
            // of the CognitoExpress object at the start of this
            // file, we support either format here. This is done
            // in case we opt to switch to access tokens at some
            // point in the future.
            req.username = authenticatedUser["cognito:username"] || authenticatedUser.username;

            // Move forward with the rest of the request
            next();
        });
    } catch (err) {
        console.err("Unexpected authentication error\n%s", err);
        res.status(500).send(responses.response500);
    }
}