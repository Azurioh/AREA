# How to Start Benchmarks

## Quick Start

To run all benchmarks for all configured servers, simply execute:

```bash
cd benchmarks/backend
./start.sh
```

This script will:
1. Build and start each server in Docker
2. Run all k6 test scripts against each server
3. Generate JSON and HTML reports
4. Clean up containers after testing

## What Happens

The `start.sh` script performs the following steps for each server:

1. **Build Docker Image**: Creates a Docker image for the server
2. **Start Container**: Runs the server container on port 3001 (mapped from container port 3000)
3. **Wait for Ready**: Waits 5 seconds for the server to be ready
4. **Run Tests**: Executes all k6 test scripts in sequence:
   - `latency.js`
   - `load.js`
   - `resource.js`
   - `soak.js`
   - `stress.js`
5. **Generate Reports**: Each test generates:
   - A JSON summary file in `results/json/`
   - An HTML report in `results/html/`
6. **Cleanup**: Stops and removes containers and images

## Running Individual Tests

If you want to run a specific test manually:

1. **Start the server**:
   ```bash
   cd benchmarks/backend/express
   docker build -t express-benchmark:1.0.0 .
   docker run -d --name express-benchmark -p 3001:3000 express-benchmark:1.0.0
   ```

2. **Run a specific k6 test**:
   ```bash
   cd benchmarks/backend
   docker run -i --rm \
       -v $(pwd):/k6 \
       --network host \
       -e SERVER_NAME=express \
       grafana/k6 run /k6/k6/latency.js
   ```

3. **Stop the server**:
   ```bash
   docker container stop express-benchmark
   docker container rm express-benchmark
   docker rmi express-benchmark:1.0.0
   ```

## Viewing Results

After running benchmarks, check the results:

- **JSON Reports**: `benchmarks/backend/results/json/`
  - Machine-readable format
  - Contains detailed metrics and statistics

- **HTML Reports**: `benchmarks/backend/results/html/`
  - Visual charts and graphs
  - Open in any web browser

## Troubleshooting

### Port Already in Use

If port 3001 is already in use, you can:
- Stop the existing container: `docker container stop express-benchmark`
- Or modify the port mapping in `start.sh`

### Server Not Responding

If tests fail with connection errors:
- Check if the container is running: `docker ps`
- Check container logs: `docker logs express-benchmark`
- Verify the server is accessible: `curl http://localhost:3001/ping`

### Insufficient Resources

For stress tests (especially `stress.js`), ensure your system has:
- Sufficient CPU cores
- Enough RAM
- Available network bandwidth
