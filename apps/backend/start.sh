#!/bin/bash

if [[ $1 == "restart" ]]; then
    docker compose --env-file .env down -v --remove-orphans
fi

docker compose --env-file .env up --build
