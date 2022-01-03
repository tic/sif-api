// Import db query function
const { query, hypertableExists, generateHeader } = require("../lib/db");
const format = require("pg-format");


// Import response templates
const responses = require("./responses");
const { response } = require("express");


// Query template for downloading some metric data from an app
const maximumChunkSize = 100;
const queryTemplate = `
SELECT * from %I
WHERE
    EXTRACT(epoch FROM time) >= $1
    AND EXTRACT(epoch FROM time) <= $2
    ORDER BY time
    LIMIT ${maximumChunkSize}
`;


// Implementation of this endpoint
exports.downloadAllMetrics = async (req, res) => {
    try {

        // Start time is required
        if (req.query.start === "" || isNaN(req.query.start)) {
            const resp = responses.response400;
            resp.details = "Must provide a valid start time (unix epoch time)";
            res.status(400).send(resp);
            return;
        }

        // End time is optional, but if one is provided,
        // it must be a valid number
        if (req.query.end !== undefined && isNaN(req.query.end)) {
            const resp = responses.response400;
            resp.details = "Providing an end time is optional, but if given, it must be valid (unix epoch time)";
            res.status(400).send(resp);
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
            const resp = responses.response404;
            res.status(400).send(resp);
            return;
        }

        // Parse the start and end times
        var queryStart = parseFloat(req.query.start) * 1000;
        var queryEnd = req.query.end === undefined ?
            (new Date()).getTime() :
            parseFloat(req.query.end) * 1000;

        // Set response headers
        // File name format: username.appName.metric.startTime_stopTime
        const filename = `${req.username}.${req.params.appName}.${queryStart}_${queryEnd}.csv`;
        res.set({
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": "text/csv",
        });

        // Write csv header to the response stream
        const csvHeaderRow = await generateHeader(tableToQuery);
        res.write(csvHeaderRow);

        // Initialize chunk variables
        var chunkStart = queryStart / 1000;
        var lastChunkSize = 0;

        do {
            // Fetch data for the current chunk
            const chunk = await query(
                tabledQueryTemplate,
                [chunkStart, queryEnd]
            );

            // Update the last chunk size
            lastChunkSize = chunk.rowCount;

            // If the current chunk is empty, then the download
            // is finished because there are no more datapoints
            // between chunkStart and queryEnd
            if (lastChunkSize === 0) {
                break;
            }

            // Update the chunk start time
            // NOTE: There is a *slight* potential here for data
            //       to be skipped when downloading. Consider a
            //       scenario where 200 datapoints had the same
            //       timestamp. This process would fetch the first
            //       100, but skip the next 100 since it increments
            //       the chunk start time by 1.
            chunkStart = (chunk.rows[lastChunkSize - 1].time.getTime() + 1) / 1000;

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
            // all of the data between chunkStart and queryEnd
        } while (lastChunkSize === maximumChunkSize);

        res.end();
        return;

    } catch (err) {
        console.log("Unexpected download error\n%s", err);

        // 500 error
        res.status(500).send(responses.response500);
    }
}
