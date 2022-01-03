
const config = require("./config");

const CognitoExpress = new (require("cognito-express"))({
    region: config.COGNITO_REGION,
    cognitoUserPoolId: `${config.COGNITO_REGION}_${config.COGNITO_POOLID}`,
    tokenUse: "access",
    tokenExpiration: 3600000,
});

exports.authenticate = (req, res) => {
    try {
        // Send through requests to the base url
        // to support basic check-if-alive pings
        if (req._parsedUrl.pathname === "/") {
            next();
            return;
        }

        // If there are no provided headers,
        // immediately deny the request
        if (!req.headers) {
            res.status(401).send({
                code: 401,
                message: "Missing Authorization header"
            });
            return;
        }

        CognitoExpress.validate(req.headers["Authorization"], (err, authenticatedUser) => {
            if (!authenticatedUser) {
                res.status(401).send({
                    code: 401,
                    message: "Missing Authorization header"
                });
                return;
            }

            if (err) {
                res.status(500).send({
                    status: 500,
                    message: "An error occurred while processing the request"
                });
            } 

            req.username = authenticatedUser.username;

            next();
        });
    } catch (err) {
        console.err("Unexpected authentication error\n%s", err);
        res.status(500).send({
            status: 500,
            message: "token verification failed"
        });
    }
}