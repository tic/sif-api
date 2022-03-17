// Load the config file
const { config } = require("./config");


// Import libraries
const { Pool } = require("pg");


// Create connection pools to the database
const pool = new Pool({
    user: config.TS_USER,
    host: config.TS_HOST,
    database: config.TS_DATABASE,
    password: config.TS_PASSWD,
    port: config.TS_PORT
});


// Executes the query given by @text using SQL
// parameters provided by @params.
async function query(text, params) {
    const client = await pool.connect();

    try {
        return await pool.query(text, params);
    } finally {
        client.release();
    }
}


// Blank template query for determining whether a
// hypertable exists or not.
const QUERY_EXISTS = `
SELECT EXISTS (
    SELECT FROM pg_tables
    WHERE
        schemaname='public'
        AND tablename=$1
);
`


// Given a table, returns a boolean value according
// to whether a hypertable with that name exists.
async function hypertableExists(table) {
    const result = await query(QUERY_EXISTS, [table]);
    return result.rows[0] && result.rows[0].exists === true;
}


// Given a table, generate a string that describes
// the columns names. Suitable for use as a csv
// header!
// NOTE: Assumes the provided table exists. If the
//       table doesn't exist, behavior of this
//       function is undefined.
async function generateHeader(table) {
    const result = await query(
        "SELECT column_name from information_schema.columns where table_name=$1",
        [table]
    );

    return result
        .rows
        .map(row => row.column_name)
        .join(",");
}


// Make the query function available elsewhere
exports.query = query;
exports.hypertableExists = hypertableExists;
exports.generateHeader = generateHeader;
