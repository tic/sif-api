'use strict';

const config = require("./lib/config");
const http = require("http");
const https = require("https");
const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


if (config.AUTH == true) {
    console.log("Authentication enabled");
    const { authenticate } = require("./lib/auth");
    app.use(authenticate);
} else {
    console.warn("AUTHENTICATION DISABLED");
}


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


server.listen(config.PORT);
server.on(
    "listening",
    () => console.log("Server is now listening for requests")
);
