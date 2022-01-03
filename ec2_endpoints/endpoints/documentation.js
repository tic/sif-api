
// OpenAPI-styled JSON describing the API
const documentation = `{
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
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
