// Import db query function
const { query } = require("../lib/db");
const format = require("pg-format");


// Import response templates
const responses = require("./responses");


// Query template for getting table schema
const queryTemplate = "SELECT DISTINCT metric FROM %I";


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

        // if there are no rows in the result, the app does not exist. return 404
        if (result.rowCount === 0) {
            return responses.response404;
        }

        const resp = responses.response200;
        resp.metrics = result.rows.map(
            rowObj => rowObj.metric
        );

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