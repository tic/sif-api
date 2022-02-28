// Load the config file
const { config } = require("./config");


// Import libraries
const { Pool } = require("pg");
const { parseSsl } = require("pg-ssl");


// Create a connection pool to the database
const pool = new Pool({
    user: config.TS_USER,
    host: config.TS_HOST,
    database: config.TS_DATABASE,
    password: config.TS_PASSWD,
    port: config.TS_PORT,
    ssl: parseSsl()
});


// Executes the query given by @text using SQL
// parameters provided by @params. Uses the
// pooled connection by checking out a client
// and releasing it after the query is done.
async function query(text, params) {
    // Check out a client from the pool
    const client = await pool.connect();

    try {
        // Query the database via the connection pool
        const dbResponse = await client.query(text, params);
        return dbResponse;

    } finally {
        // Release the pool client after the job is done
        client.release();
    }
}


// Make the query function available elsewhere
exports.query = query;
