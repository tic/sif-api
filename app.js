// Used for running the lambda function
// contained in index.js

const { handler } = require("./index");

function testSchema() {
    handler({
        params: {
            path: {
                app_name: "vst0"
            }
        },
        context: {
            username: "gmf",
            resourcePath: "/apps/app/{app_name}/schema"
        }
    }).then(r => console.log(r))
    .catch(e => console.log(e));
}

testSchema();