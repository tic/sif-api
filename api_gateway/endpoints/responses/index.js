// This file contains the default response objects
// for each response code the API endpoints are
// allowed to generate.


// The default response for STATUS 200 - OK
exports.response200 = {
    code: 200
};


// The default response for STATUS 404 - NOT FOUND
exports.response404 = {
    code: 404,
    message: "App does not exist"
};


// The default response for STATUS 500 - INTERNAL SERVER ERROR
exports.response500 = {
    code: 500,
    message: "An error occurred while processing the request"
}