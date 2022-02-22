// Load the config file
const { config } = require("./config");


// Import libraries
const { Pool } = require("pg");
const { parseSsl } = require("pg-ssl");


// Executes the query given by @text using SQL
// parameters provided by @params. Since this
// code is intended to run in Lambda, connection
// pools are created dynamically upon a query
// being submitted to the system.
async function query(text, params) {
    // Create a connection pool to the database
    const pool = new Pool({
        user: config.TS_USER,
        host: config.TS_HOST,
        database: config.TS_DATABASE,
        password: config.TS_PASSWD,
        port: config.TS_PORT,
        ssl: parseSsl()
    });

    const dbResponse = await pool.query(text, params);

    await pool.end()

    return dbResponse;
}


// Make the query function available elsewhere
exports.query = query;
