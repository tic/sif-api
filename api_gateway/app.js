// Used for running the lambda function
// contained in index.js

const { handler } = require("./index");

function testSchema() {
    handler({
        params: {
            path: {
                app_name: "machineUsage"
            },
            querystring: {
                start: "1643041334"
            }
        },
        context: {
            username: "gmf",
            resourcePath: "/apps/app/{app_name}/count"
        }
    }).then(r => console.log(r))
    .catch(e => console.log(e));
}

testSchema();