// Import db query function
const { query } = require("../lib/db");
const format = require("pg-format");


// Import response templates
const responses = require("./responses");


// Query template for downloading some metric data from an app
const maximumChunkSize = 100;
const queryTemplate = `
SELECT * from %I
WHERE
    metric=$1
    AND EXTRACT(epoch FROM time) > $2
    ORDER BY time
    OFFSET $3
    LIMIT ${maximumChunkSize}
`;


// Implementation of this endpoint
exports.handler = async (appId) => {
    try {






        const result = await query(
            format(
                queryTemplate,
                [appId]
            )
        );

        if (!result) {
            throw "Invalid result object";
        }

        const resp = responses.response200;
        resp.deleted = true;

        return resp;

    } catch (err) {
        // Error code 42P01 is "Relation ... does not exist"
        // In other words, the app does not exist
        if (err.code === "42P01") {
            return responses.response404;
        }

        // 500 error
        return responses.response500;
    }
}