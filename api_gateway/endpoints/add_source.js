// Import db query function
const { query } = require("../lib/db");


// Import response templates
const responses = require("./responses");


// Query template for retrieving errors
const queryTemplate = `
INSERT
INTO "sources"(username, type, metadata)
VALUES($1, $2, $3::json)
`;


// Implementation of this endpoint
exports.handler = async (username, sourceTypeName, metadata) => {
    try {

        if(!(metadata instanceof Object)) {
            try {
                // If this line succeeds, then 'metadata' is a valid
                // JSON and we can use it as an input string later on.
                JSON.parse(metadata);
            } catch(err) {
                // If the JSON was invalid, respond appropriately.
                // Otherwised, bubble up the error up to a 500.
                if(err instanceof SyntaxError) {
                    const resp = Object.assign({}, responses.response400);
                    resp.message = "failed to parse JSON";
                    return resp;
                } else throw err;
            }
        }

        const result = await query(
            queryTemplate,
            [
                username,
                sourceTypeName,
                JSON.stringify(metadata)
            ],
            "tracking"
        );

        if (!result) {
            throw "Invalid result object"
        }

        if(result.rowCount === 1) {
            return responses.response200;
        } else {
            return responses.response500;
        }

    } catch (err) {
        // 500 error
        console.log(err);
        return responses.response500;
    }
}
