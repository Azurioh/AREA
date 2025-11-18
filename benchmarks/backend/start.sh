#!/bin/bash

DEFAULT_LOCAL_URL="http://host.docker.internal:3001/ping"

SKIP_LOCAL=false
SKIP_CLOUD=false
SKIP_BUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --local-only)
            SKIP_CLOUD=true
            shift
            ;;
        --cloud-only)
            SKIP_LOCAL=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --local-only       Only run benchmarks for local servers"
            echo "  --cloud-only       Only run benchmarks for cloud servers"
            echo "  --skip-build       Skip building the server image"
            echo "  --help, -h         Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                 # Run all benchmarks"
            echo "  $0 --local-only    # Only run local server benchmarks"
            echo "  $0 --cloud-only    # Only run cloud server benchmarks"
            echo "  $0 --skip-build    # Skip building the server image"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

start_server() {
    echo "Building and starting server $1..."
    cd $1

    if [ "$SKIP_BUILD" = false ]; then
        docker build -t $1-benchmark:1.0.0 .
    fi

    docker run -d --name $1-benchmark -p 3001:3000 $1-benchmark:1.0.0

    cd ..
    sleep 5
}

stop_server() {
    echo "Stopping and cleaning up server $1..."
    docker container stop $1-benchmark
    docker container rm $1-benchmark
    docker rmi $1-benchmark:1.0.0
}

start_benchmark() {
    local server_name=$1
    local server_url=$2
    local output_dir="results"

    mkdir -p $output_dir

    start_server $server_name

    for file in k6/*.js; do

        echo "--------------------------------"
        echo "Running $file with k6 in Docker for $server_name..."
        echo "Target URL: $server_url"

        docker run -i --rm \
            -v $(pwd):/k6 \
            --network host \
            -e SERVER_NAME=$server_name \
            -e SERVER_URL=$server_url \
            grafana/k6 run /k6/$file

        echo "Summary files (JSON/HTML) are saved in the $output_dir directory."
        echo "--------------------------------"
    done

    stop_server $server_name
}

deploy_cloud_server() {
    local server_name=$1
    local deploy_script="$server_name/deploy.sh"

    if [ ! -f "$deploy_script" ]; then
        echo "Error: Deploy script not found: $deploy_script" >&2
        exit 1
    fi

    chmod +x "$deploy_script"

    cd "$server_name"
    local server_url=$(bash deploy.sh)
    cd ..

    if [ -z "$server_url" ]; then
        echo "Error: Failed to get URL from deploy script for $server_name" >&2
        exit 1
    fi

    echo "$server_url"
}

stop_cloud_server() {
    local server_name=$1
    local cleanup_script="$server_name/cleanup.sh"

    if [ ! -f "$cleanup_script" ]; then
        echo "Warning: Cleanup script not found: $cleanup_script" >&2
        return
    fi

    chmod +x "$cleanup_script"

    cd "$server_name"
    bash cleanup.sh
    cd ..
}

start_cloud_benchmark() {
    local server_name=$1
    local output_dir="results"

    mkdir -p $output_dir

    echo "Deploying $server_name..."
    local server_url=$(deploy_cloud_server $server_name)

    if [ -z "$server_url" ]; then
        echo "Error: Failed to deploy $server_name or get its URL" >&2
        exit 1
    fi

    echo "Deployed $server_name successfully. API URL: $server_url"

    for file in k6/*.js; do
        echo "--------------------------------"
        echo "Running $file with k6 in Docker for $server_name..."
        echo "Target URL: $server_url"

        docker run -i --rm \
            -v $(pwd):/k6 \
            --network host \
            -e SERVER_NAME=$server_name \
            -e SERVER_URL=$server_url \
            grafana/k6 run /k6/$file

        echo "Summary files (JSON/HTML) are saved in the $output_dir directory."
        echo "--------------------------------"
    done

    echo "Cleaning up $server_name deployment..."
    stop_cloud_server $server_name
}

LOCAL_SERVERS=("express" "fastify" "nest" "fastapi")
CLOUD_SERVERS=("aws-lambda")

if [ "$SKIP_LOCAL" = false ]; then
    for server in ${LOCAL_SERVERS[@]}; do
        echo "--------------------------------"
        echo "Starting benchmarks for $server"
        start_benchmark $server "$DEFAULT_LOCAL_URL"
    done
fi

if [ "$SKIP_CLOUD" = false ]; then
    for server in ${CLOUD_SERVERS[@]}; do
        echo "--------------------------------"
        echo "Starting benchmarks for $server"
        start_cloud_benchmark $server
    done
fi
