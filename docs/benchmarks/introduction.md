# Benchmarks Introduction

## Overview

This benchmarking system is designed to evaluate the performance of different backend frameworks and languages. It uses **k6** for load testing and **Docker** for containerization to ensure consistent testing environments.

## Architecture

The benchmark system consists of three main components:

1. **Backend Servers**: Containerized applications that expose a simple API endpoint (`/ping`)
2. **k6 Tests**: Performance test scripts that simulate various load scenarios
3. **Results**: Generated reports in both JSON and HTML formats

## Current Setup

### Supported Frameworks

- **Express** (Node.js/TypeScript)

### Test Types

The benchmark suite includes five different test types:

1. **Latency Test** (`latency.js`): Measures response times with moderate load
   - 50 virtual users
   - 30 seconds duration
   - 1 second sleep between requests

2. **Load Test** (`load.js`): Gradually increases load to test scalability
   - Stages: 50 → 200 → 500 virtual users
   - 20 seconds per stage

3. **Resource Test** (`resource.js`): Monitors resource usage and response times
   - 50 virtual users
   - 30 seconds duration
   - Tracks custom RPS trends

4. **Soak Test** (`soak.js`): Long-running test to identify memory leaks and stability issues
   - 100 virtual users
   - 1 hour duration
   - 1 second sleep between requests

5. **Stress Test** (`stress.js`): Pushes the system to its limits
   - Stages: 50 → 2000 → 5000 virtual users
   - 20 seconds per stage

## Test Endpoint

All tests target a simple `/ping` endpoint that returns:
```json
{ "ok": true }
```

This endpoint is used as a baseline to measure framework overhead and performance characteristics.

## Results

Test results are automatically saved in the `benchmarks/backend/results/` directory:
- **JSON reports**: Detailed metrics in `results/json/`
- **HTML reports**: Visual reports in `results/html/`

Each report is timestamped and includes the server name and test type in the filename.

## Prerequisites

- Docker installed and running
- Sufficient system resources for running containers and load tests
