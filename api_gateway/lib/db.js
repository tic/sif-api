// Load the config file
const { config } = require("./config");


// Import libraries
const { Pool } = require("pg");


// Create connection pools to the database
const poolData = new Pool({
    user: config.TS_USER,
    host: config.TS_HOST,
    database: config.TS_DATABASE,
    password: config.TS_PASSWD,
    port: config.TS_PORT
});

const poolIB = new Pool({
    user: config.TS_USER_IB,
    host: config.TS_HOST,
    database: config.TS_DATABASE,
    password: config.TS_PASSWD_IB,
    port: config.TS_PORT
});

const poolTracking = new Pool({
    user: config.TS_USER,
    host: config.TS_HOST,
    database: config.TS_DATABASE_TRACKING,
    password: config.TS_PASSWD,
    port: config.TS_PORT
});


// Executes the query given by @text using SQL
// parameters provided by @params. Uses the
// pooled connection by checking out a client
// and releasing it after the query is done.
async function query(text, params, poolName) {
    // Pick the correct pool
    let pool;
    if(poolName === undefined || poolName === "data") {
        pool = poolData;
    } else if(poolName === "tracking") {
        pool = poolTracking;
    } else if(poolName === "delete") {
        pool = poolIB;
    } else {
        throw new Error("unknown pool type");
    }
    
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
