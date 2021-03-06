// Import db query function
const { query } = require("../lib/db");
const format = require("pg-format");


// Import response templates
const responses = require("./responses");


// Query template for getting table schema
const queryTemplate = `
SELECT column_name, data_type
FROM
    information_schema.columns
WHERE
    table_name=$1
    AND column_name != 'time'
    AND column_name != 'metric'
    AND column_name != 'value'
`;


// Implementation of this endpoint
exports.handler = async (appId) => {
    try {
        const result = await query(queryTemplate, [appId]);

        if (!result) {
            throw "Invalid result object";
        }

        // if there are no rows in the result, the app does not exist. return 404
        if (result.rowCount === 0) {
            return responses.response404;
        }

        const resp = Object.assign({}, responses.response200);
        resp.schema = result.rows.map(
            rowObj => ({
                column: rowObj.column_name,
                datatype: rowObj.data_type.toUpperCase()
            })
        );

        return resp;

    } catch (err) {
        // 500 error
        console.log(err);
        return responses.response500;
    }
}