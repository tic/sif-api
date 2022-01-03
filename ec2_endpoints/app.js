'use strict';

// Load configuration file
const { config } = require("./lib/config");


// Import libraries
const http = require("http");
const https = require("https");
const express = require("express");
const cors = require("cors");


// Initialize and configure app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Attach authentication middleware, if the
// configuration specifies authentication
if (config.AUTH == "true") {
    console.log("Authentication enabled");
    const { authenticate } = require("./lib/auth");
    app.use(authenticate);
} else {
    console.warn("AUTHENTICATION DISABLED");
    app.use((req, res, next) => {
        req.username = "";
        next();
    });
}


// Create download routes
app.get("/v1/:appName/all", require("./endpoints/download").downloadAllMetrics);
app.get("/v1/:appName/metric/:metric", require("./endpoints/downloadMetric").downloadSingleMetric);


// Create documentation route
app.get("/v1/documentation", require("./endpoints/documentation").getDocumentation);


// Create the server (with SSL)
// parameters, if necessary
var server;
if (config.SSL == true) {
    config.PORT = 443;
    const fs = require("fs");
    const options = {
        key: fs.readFileSync(config.KEY_FILE),
        cert: fs.readFileSync(config.CERTIFICATE)
    }
    server = https.createServer(options, app);
} else {
    config.PORT = 3000;
    server = http.createServer(app);
}


// Start up the server
server.listen(config.PORT);
server.on(
    "listening",
    () => console.log("Server is now listening for requests")
);
