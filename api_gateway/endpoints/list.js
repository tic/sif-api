// Import db query function
const { query } = require("../lib/db");
const format = require("pg-format");


// Import response templates
const responses = require("./responses");


// Query template for getting owned apps
const queryTemplate = "SELECT DISTINCT table_name FROM information_schema.columns WHERE table_name LIKE CONCAT($1::varchar, '\\_%')";


// Implementation of this endpoint
exports.handler = async (username) => {
    try {
        const result = await query(queryTemplate, [username]);

        if (!result) {
            throw "Invalid result object";
        }

        const resp = responses.response200;
        resp.apps = result.rows.map(
            rowObj => rowObj.table_name
        );

        return resp;

    } catch (err) {
        // 500 error
        console.log(err);
        return responses.response500;
    }
}