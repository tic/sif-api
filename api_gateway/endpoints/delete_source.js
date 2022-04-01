// Import db query function
const { query } = require("../lib/db");


// Import response templates
const responses = require("./responses");


// Query template for retrieving errors
const queryTemplate = `
DELETE
FROM "sources"
WHERE
    username=$1 AND
    id=$2
`;


// Implementation of this endpoint
exports.handler = async (username, sourceId) => {
    try {

        const result = await query(
            queryTemplate,
            [
                username,
                sourceId
            ],
            "tracking"
        );

        if (!result) {
            throw "Invalid result object"
        }

        if(result.rowCount === 1) {
            return responses.response200;
        } else {
            const resp = Object.assign({}, responses.response404);
            resp.message = "Source does not exist";
            return resp;
        }

    } catch (err) {
        // 500 error
        console.log(err);
        return responses.response500;
    }
}
