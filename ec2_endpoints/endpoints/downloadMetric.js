// Import db query function
const { query, hypertableExists, generateHeader } = require("../lib/db");
const format = require("pg-format");


// Import response templates
const responses = require("./responses");
const { response } = require("express");


// Query template for downloading some metric data from an app
const maximumChunkSize = 30000;
const queryTemplate = `
SELECT * from %I
WHERE
    metric=$1
    time >= to_timestamp($2)
    time <= to_timestamp($3)
    OFFSET $4
    LIMIT ${maximumChunkSize}
`;


// Implementation of this endpoint
exports.downloadSingleMetric = async (req, res) => {
    try {

        // Start time is required
        if (isNaN(req.query.start)) {
            const resp = Object.assign({}, responses.response400);
            resp.details = "Must provide a valid start time (unix epoch time)";
            res.status(400).json(resp);
            return;
        }

        // End time is optional, but if one is provided,
        // it must be a valid number
        if (req.query.end !== undefined && isNaN(req.query.end)) {
            const resp = Object.assign({}, responses.response400);
            resp.details = "Providing an end time is optional, but if given, it must be valid (unix epoch time)";
            res.status(400).json(resp);
            return;
        }

        // Build the table name from the given parameters
        const tableToQuery = `${req.username}_${req.params.appName}`;
        const tabledQueryTemplate = format(
            queryTemplate,
            tableToQuery
        );

        // Check to see if the app actually exists
        const tableExists = await hypertableExists(tableToQuery);
        if (!tableExists) {
            const resp = Object.assign({}, responses.response404);
            res.status(400).json(resp);
            return;
        }

        // Parse the start and end times
        var queryStart = parseFloat(req.query.start);
        var queryEnd = req.query.end === undefined ?
            (new Date()).getTime() / 1000 :
            parseFloat(req.query.end);

        if (queryStart > queryEnd) {
            const resp = Object.assign({}, responses.response400);
            resp.message = "Invalid start and end time combination";
            resp.details = "The start time cannot be after the end time. If end time was not specified, it defaults to the current time, so querying a start date that is in the future and providing no end date is a bad request"
            res.status(400).json(resp);
            return;
        }

        // Set response headers
        // File name format: username.appName.metric.startTime_stopTime
        const filename = `${req.username}.${req.params.appName}.${req.params.metric}.${queryStart}-${queryEnd}.csv`;
        res.set({
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": "text/csv",
        });

        // Write csv header to the response stream
        const csvHeaderRow = await generateHeader(tableToQuery);
        res.write(csvHeaderRow);

        // Initialize chunk variables
        let offset = 0;
        let lastChunkSize = 0;
        let abortDl = false;

        // Register cancelled download handlers
        res.on("aborted", () => abortDl = true);
        res.on("close", () => abortDl = true);

        do {
            // Increase offset based on previous chunk
            offset += lastChunkSize;

            // Query db for the chunk
            const chunk = await query(
                tabledQueryTemplate,
                [req.params.metric, queryStart, queryEnd, offset]
            );

            // Record how many rows were found
            lastChunkSize = chunk.rowCount;

            // Transform the fetched data
            const transformedRowData = chunk.rows.map(
                row => {
                    row.time = row.time.getTime() / 1000;
                    return Object.values(row).join(",");
                }
            );

            // Reduce the data down to a string
            const dataString = transformedRowData.join("\n");

            // Append the data string to the response stream
            res.write("\n" + dataString);

            // Continue to the next chunk if the last chunk 
            // was a full chunk. Otherwise, we have retrieved
            // all of the data between queryStart and queryEnd
        } while (lastChunkSize === maximumChunkSize && abortDl === false);

        res.end();
        return;

    } catch (err) {
        console.log("Unexpected download error\n%s", err);

        // 500 error
        res.status(500);
        res.write("download failed");
        res.end();
    }
}