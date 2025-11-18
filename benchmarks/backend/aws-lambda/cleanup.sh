#!/bin/bash

# Cleanup AWS Lambda deployment
# This script should be called from the start.sh script

set -e

echo "Removing AWS Lambda deployment..." >&2

# Remove the deployment using serverless
npx serverless remove >&2

echo "AWS Lambda deployment removed successfully" >&2
