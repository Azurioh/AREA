#!/bin/bash

start_server() {
    echo "Building and starting server $1..."
    cd $1

    docker build -t $1-benchmark:1.0.0 .
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
    local output_dir="results"

    mkdir -p $output_dir

    start_server $server_name

    for file in k6/*.js; do

        echo "--------------------------------"
        echo "Running $file with k6 in Docker for $server_name..."

        docker run -i --rm \
            -v $(pwd):/k6 \
            --network host \
            -e SERVER_NAME=$server_name \
            grafana/k6 run /k6/$file

        echo "Summary files (JSON/HTML) are saved in the $output_dir directory."
        echo "--------------------------------"
    done

    stop_server $server_name
}

SERVERS=("express" "fastify" "fastapi")

for server in ${SERVERS[@]}; do
    echo "--------------------------------"
    echo "Starting benchmarks for $server"
    start_benchmark $server
done
