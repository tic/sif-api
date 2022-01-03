# SIF API - EC2 Endpoints

### Purpose

This API contains endpoints used to download data from the SIF platform. It supports downloads of arbitrary size and streams responses to reduce strain on the server and make download progress more transparent, among other reasons. These endpoints are hosted at a different subdomain (`download.uvasif.org`) than the rest of the API endpoints (`api.uvasif.org`).

## API Documentation

You can retrieve the API documentation by visiting https://download.uvasif.org/v1/documentation. This endpoint displays an OpenAPI-styled JSON representing the API. For a more visual representation of the API, we recommend visiting the [Swagger Pet Store](https://petstore.swagger.io/), pasting the above link into box on the top of the page, and clicking Explore.

## Using the hosted API

Outside of development, we expect all users of the SIF platform to interact with this API via the domain `download.uvasif.org`.  Please note that the API uses HTTPS, and will not respond to HTTP requests. In other words, SSL is mandatory.

## Running the API locally

Prerequisites:

1. NodeJS v14.15.4
2. npm v6.14.10
3. A CA certificate for the database

### Environment File

The `.env` file should be placed in the `/ec2_endpoints` folder, at the same directory hierarchy level as `app.js`. It should have the following values:

Field | Value
----- | -----
AUTH | Boolean -- should authentication be enabled? **Warning:** if auth is disabled, the API cannot correctly determine table names to pull data from. Disabling auth requires a manual solution to this problem (see line 30 in `app.js`).
SSL | Boolean -- should SSL be enabled? This is necessary for the API to run on port 443
COGNITO_REGION | AWS region where the Cognito user pool is configured
COGNITO_POOLID | Pool id of the Cognito user pool provided credentials belong to
TS_USER | PostgreSQL database username
TS_PASSWD | PostgreSQL database password
TS_HOST | PostgreSQL database hostname
TS_PORT | PostgreSQL database port
TS_DATABASE | PostgreSQL database name
PGSSLROOTCERT | `/path/to/ca.pem` (path to CA certificate, used for opening an SSL connection with the database)

### Launching the API

Once the environment file is set up and the required packages are installed, all you need to do is navigate to the `/ec2_endpoints` folder and run the command:

    node app.js
