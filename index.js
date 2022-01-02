'use strict';

const endpoints = {
    "/apps/list": require("./endpoints/list").handler,
    "/apps/app/{app_name}/schema": require("./endpoints/schema").handler,
    "/apps/app/{app_name}/download": require("./endpoints/download").handler,
    "/apps/app/{app_name}/download/{metric}": require("./endpoints/downloadMetric").handler,
    "/apps/app/{app_name}": require("./endpoints/deleteApp").handler,
    "/apps/app/{app_name}/metrics": require("./endpoints/metrics").handler
};


function generateAppId(username, appName) {
    return `${username}_${appName}`;
}

exports.handler = async (event, lambdaContext) => {
    // Username accessible via `event.context.username`
    // Current resource path accessible via `event.context.requestPath`
    // Path parameter for app_name accessible via `event.params.path.app_name`

    // Use the proper handler, based on the path
    var handler = endpoints[event.context.resourcePath];
    var response;
    switch (event.context.resourcePath) {

        // GET - List owned apps
        case "/apps/list":
            response = await handler(event.context.username);
            break;


        // GET - Display schema for an app
        case "/apps/app/{app_name}/schema":
            response = await handler(
                generateAppId(
                    event.context.username,
                    event.params.path.app_name
                )
            );
            break;

        // DELETE - Delete an app (i.e. drop the app table)
        case "/apps/app/{app_name}":
            response = await handler(
                generateAppId(
                    event.context.username,
                    event.params.path.app_name
                )
            )
            break;

        // GET - List metrics present in an app
        case "/apps/app/{app_name}/metrics":
            response = await handler(
                generateAppId(
                    event.context.username,
                    event.params.path.app_name
                )
            )
            break;
    }
    console.log("Done");

    return response;
};
