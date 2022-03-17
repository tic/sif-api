// Import db query function
const { query } = require("../lib/db");
const format = require("pg-format");


// Import response templates
const responses = require("./responses");


// Query template for deleting an app
const queryTemplate = "DROP TABLE %I";


// Implementation of this endpoint
exports.handler = async (appId) => {
    try {
        const result = await query(
            format(
                queryTemplate,
                [appId]
            ),
            [],
            "delete"
        );

        if (!result) {
            throw "Invalid result object";
        }

        const resp = Object.assign({}, responses.response200);
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