#!/bin/bash

set -e

echo "Deploying AWS Lambda function..." >&2

DEPLOY_OUTPUT=$(npx serverless deploy 2>&1)
echo "$DEPLOY_OUTPUT" >&2

API_URL=$(npx serverless info 2>&1 | grep endpoint | grep -oE 'https://[^[:space:]]+' | head -1)

if [ -z "$API_URL" ]; then
    echo "Error: Could not retrieve API URL from serverless deployment" >&2
    echo "Please check that the deployment was successful and the API Gateway was created." >&2
    exit 1
fi

if [[ ! "$API_URL" =~ /dev/ping ]]; then
    API_URL="${API_URL}/dev/ping"
fi

echo "$API_URL"
