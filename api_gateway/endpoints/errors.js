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
    app_id LIKE CONCAT($1::varchar, '\\_%')
ORDER BY
    timestamp desc`;


// Implementation of this endpoint
exports.handler = async (username) => {
    try {
        const result = await query(queryTemplate, [username], "tracking");

        if (!result) {
            throw "Invalid result object"
        }

        const resp = Object.assign({}, responses.response200);
        resp.errors = result.rows.map(
            rowObj => ({
                errorId: rowObj.id,
                appName: rowObj.app_id.substring(rowObj.app_id.indexOf("_") + 1),
                timestamp: rowObj.timestamp,
                device: rowObj.device,
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
