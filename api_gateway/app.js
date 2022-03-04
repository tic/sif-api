// Used for running the lambda function
// contained in index.js

const { handler } = require("./index");

function testSchema() {
    handler({
        params: {
            path: {
                
            },
            querystring: {
                
            }
        },
        context: {
            username: "",
            resourcePath: ""
        }
    }).then(r => console.log(r))
    .catch(e => console.log(e));
}

testSchema();