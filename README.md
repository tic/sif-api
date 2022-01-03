# SIF API

### Purpose
This repository contains the two API deployments used by the SIF platform to enable programmatic access to its services. Below is a brief description of what is found in each sub-folder. For a more detailed description, check out the README.md in the sub-folder of interest.

## api_gateway

In this section, you will find the bulk of the SIF API. The code comprises an AWS Lambda function that is triggered when endpoints of `api.uvasif.org` are hit. We make use of a unified Lambda function -- in other words, each endpoint runs the same code, and the code selects the correct behavior based on contextual information, like provided parameters and request path.

## ec2_endpoints

In this section, you will find the "stream" endpoints of the SIF API, hosted on `download.uvasif.org`. These endpoints, unlike those on the `api` subdomain, do not provide instantaneous responses. Instead, they stream their responses, allowing for bulk data acquisition in a sustainable fashion.
