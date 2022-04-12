
// OpenAPI-styled JSON describing the API
const documentation = `{
  "openapi": "3.0.0",
  "info": {
    "version": "1.1.0",
    "title": "SIF Download API",
    "license": {
      "name": "MIT"
    }
  },
  "servers": [
    {
      "url": "download.uvasif.org"
    }
  ],
  "paths": {
    "/v1/documentation": {
        "get": {
            "summary": "Retrieve this documentation in JSON format",
            "tags": [
                "Information"
            ],
            "parameters": [],
            "responses": {
                "200": {
                    "description": "The JSON documentation object",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "500": {
                    "description": "",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Error"
                            }
                        }
                    }
                }
            }
        }
    },
    "/v1/{appName}/all": {
        "get": {
            "summary": "Download all data from an app",
            "tags": [
                "Download"
            ],
            "parameters": [
                {
                    "name": "appName",
                    "in": "path",
                    "description": "Name of the app to download data from",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "start",
                    "in": "query",
                    "description": "Start time for the download window in Unix Epoch time (seconds)",
                    "required": true,
                    "schema": {
                        "type": "number"
                    }
                },
                {
                    "name": "end",
                    "in": "query",
                    "description": "End time for the download window in Unix Epoch time (seconds). Defaults to now",
                    "required": false,
                    "schema": {
                        "type": "number"
                    }
                },
                {
                    "name": "bucket",
                    "in": "query",
                    "description": "Number of seconds (>=1) to bucket the results by. If not provided, results are not bucketed at all",
                    "required": false,
                    "schema": {
                        "type": "number"
                    }
                },
                {
                    "name": "metadata",
                    "in": "query",
                    "description": "Stringified JSON object of metadata key/values to match on",
                    "required": false,
                    "schema": {
                        "type": "object"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "A CSV containing the downloaded data",
                    "content": {
                        "text/csv": {
                            "schema": {
                                "type": "string"
                            }
                        }
                    }
                },
                "400": {
                    "description": "",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Error"
                            }
                        }
                    }
                },
                "500": {
                    "description": "",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Error"
                            }
                        }
                    }
                }
            }
        }
    },
    "/v1/{appName}/metric/{metric}": {
        "get": {
            "summary": "Download data from an app for a single metric",
            "tags": [
                "Download"
            ],
            "parameters": [
                {
                    "name": "appName",
                    "in": "path",
                    "description": "Name of the app to download data from",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }, {
                    "name": "metric",
                    "in": "path",
                    "description": "Metric to download data for",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "start",
                    "in": "query",
                    "description": "Start time for the download window in Unix Epoch time (seconds)",
                    "required": true,
                    "schema": {
                        "type": "number"
                    }
                },
                {
                    "name": "end",
                    "in": "query",
                    "description": "End time for the download window in Unix Epoch time (seconds). Defaults to now",
                    "required": false,
                    "schema": {
                        "type": "number"
                    }
                },
                {
                    "name": "bucket",
                    "in": "query",
                    "description": "Number of seconds (>=1) to bucket the results by. If not provided, results are not bucketed at all",
                    "required": false,
                    "schema": {
                        "type": "number"
                    }
                },
                {
                    "name": "metadata",
                    "in": "query",
                    "description": "Stringified JSON object of metadata key/values to match on",
                    "required": false,
                    "schema": {
                        "type": "object"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "A CSV containing the downloaded data",
                    "content": {
                        "text/csv": {
                            "schema": {
                                "type": "string"
                            }
                        }
                    }
                },
                "400": {
                    "description": "",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Error"
                            }
                        }
                    }
                },
                "500": {
                    "description": "",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Error"
                            }
                        }
                    }
                }
            }
        }
    }
  },
  "components": {
    "schemas": {
      "Error": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "integer",
            "format": "uint32"
          },
          "message": {
            "type": "string"
          },
          "details": {
              "type": "string"
          }
        }
      }
    },
    "securitySchemes": {
      "BearerToken": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "security": [
    {
      "BearerToken": []
    }
  ]
}`;


// Implementation of this endpoint
exports.getDocumentation = (req, res) => {
    res.status(200).send(documentation);
}
