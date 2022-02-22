// Import db query function
const { query } = require("../lib/db");


// Import response templates
const responses = require("./responses");


// Query template for retrieving errors
const queryTemplate = `
SELECT *
FROM
    "errorTable"
WHERE
    username=$1`;


// Implementation of this endpoint
exports.handler = async (username) => {
    try {
        const result = await query(queryTemplate, [username]);

        if (!result) {
            throw "Invalid result object"
        }

        const resp = Object.assign({}, responses.response200);
        resp.errors = result.rows.map(
            rowObj => ({
                errorId: rowObj.id,
                timestamp: rowObj.timestamp,
                error: rowObj.error
            })
        );

        return resp;

    } catch (err) {
        // 500 error
        console.log(err);
        return responses.response500;
    }
}