// Import db query function
const { query } = require("../lib/db");
const format = require("pg-format");


// Import response templates
const responses = require("./responses");


// Query template for getting owned apps
const queryTemplate = `
SELECT COUNT(*)
FROM
    (
        SELECT time
        FROM %I
        WHERE
            EXTRACT(epoch FROM time) >= $1
            AND EXTRACT(epoch FROM time) <= $2
    )
AS
    ct
`;


// Implementation of this endpoint
exports.handler = async (appId, rangeStart, rangeEnd) => {
    try {
        // A start or end parameter, if given, must be valid numbers
        if (
            (rangeStart !== undefined && isNaN(rangeStart))
            || (rangeEnd !== undefined && isNaN(rangeEnd))
        ) {
            const resp = Object.assign({}, responses.response400);
            resp.details = "If provided, query arguments 'start' and 'end' must be valid numbers";
            return resp;
        }

        let cleanStart = rangeStart;
        if (cleanStart === undefined) {
            cleanStart = 0;
        } else {
            cleanStart = parseFloat(rangeStart);
        }

        let cleanEnd = rangeEnd;
        if (cleanEnd === undefined) {
            cleanEnd = (new Date()).getTime() / 1000;
        } else {
            cleanEnd = parseFloat(rangeEnd);
        }

        const result = await query(
            format(
                queryTemplate,
                appId
            ),
            [cleanStart, cleanEnd]
        );

        if (!result) {
            throw "Invalid result object";
        }

        const resp = Object.assign({}, responses.response200);
        resp.count = parseInt(result.rows[0].count);
        resp.bounds = {
            start: cleanStart,
            end: cleanEnd
        }

        return resp;

    } catch (err) {
        // 500 error
        console.log(err);
        return responses.response500;
    }
}