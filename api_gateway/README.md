# SIF API - API Gateway

### Purpose

This API contains endpoints used to retrieve information from the SIF platform. It **does not** contain endpoints for downloading data (for that, see the other folder in this repo: `/ec2_endpoints`). These endpoints allow a user to get information such as:

1. A list of their apps
2. Metrics present in an app
3. The schema of an app
... and more!

## API Documentation

You can retrieve the API documentation by visiting https://api.uvasif.org/v1/documentation. This endpoint displays an OpenAPI-styled JSON representing the API. For a more visual representation of the API, we recommend visiting the [Swagger Pet Store](https://petstore.swagger.io/), pasting the above link into box on the top of the page, and clicking Explore.

## Using the hosted API

Outside of development, we expect all users of the SIF platform to interact with this API via the domain `api.uvasif.org`. This will ensure your queries are properly routed through the API gateway and minimize failure probability.

## Running the API locally

Prerequisites:

1. NodeJS v14.15.4
2. npm v6.14.10
3. A CA certificate for the database

### Environment File

The `.env` file should be placed in the `/api_gateway` folder, at the same directory hierarchy level as `app.js`. It should have the following values:

Field | Value
----- | -----
TS_USER | PostgreSQL database username
TS_PASSWD | PostgreSQL database password
TS_HOST | PostgreSQL database hostname
TS_PORT | PostgreSQL database port
TS_DATABASE | PostgreSQL database name
PGSSLROOTCERT | `/path/to/ca.pem` (path to CA certificate, used for opening an SSL connection with the database)

### Launching the API

It is not as simple as running a script and using Postman/curl/etc. with this API. Since the endpoints contained here are designed to be served by Lambda, it has to follow a serverless structure. Accordingly, you will need to edit `app.js` to select the desired route and provide necessary parameters. Once this is complete, run the command:

    node app.js

This will import the Lambda handler contained in `index.js` and route the provided query to the necessary endpoint. Take care when doing this, because manually editing the route and parameters in `app.js` makes it possible to encouter use cases that are impossible in the real world and are not handled.
