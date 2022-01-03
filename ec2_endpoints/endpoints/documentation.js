
// OpenAPI-styled JSON describing the API
const documentation = `TODO`;


// Implementation of this endpoint
exports.getDocumentation = (req, res) => {
    res.status(200).send(documentation);
}
