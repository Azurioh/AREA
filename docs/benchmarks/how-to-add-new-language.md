# How to Add a New Language/Framework

This guide explains how to add a new backend framework or language to the benchmark suite.

## Directory Structure

Create a new directory in `benchmarks/backend/` following this structure:

```
benchmarks
└── backend/
    └── your-framework/
        ├── Dockerfile
        ├── package.json (or equivalent)
        ├── src/ (or equivalent)
        │   └── server.ts (or .js, .py, etc.)
        └── [other config files]
```

## Step-by-Step Guide

### 1. Create the Directory

```bash
mkdir -p benchmarks/backend/your-framework
cd benchmarks/backend/your-framework
```

### 2. Implement the Server

Create a simple HTTP server that responds to GET requests at `/ping`:

**Example (Node.js/Express):**
```typescript
import express from "express";

const app = express();

app.get("/ping", (_req, res) => {
    res.json({ ok: true });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

### 3. Create a Dockerfile

The Dockerfile should:
- Use an appropriate base image for your language
- Install dependencies
- Build/compile if necessary
- Expose port 3000
- Start the server

**Example (Node.js/TypeScript):**
```dockerfile
FROM node:slim

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
EXPOSE 3000

RUN npm run build
CMD ["npm", "start"]
```

### 4. Add to start.sh

Edit `benchmarks/backend/start.sh` and add your framework to the `SERVERS` array:

```bash
SERVERS=("express" "your-framework")
```

### 5. Test Locally

Before running the full benchmark suite, test your server:

```bash
# Build the image
docker build -t your-framework-benchmark:1.0.0 .

# Run the container
docker run -d --name your-framework-benchmark -p 3001:3000 your-framework-benchmark:1.0.0

# Test the endpoint
curl http://localhost:3001/ping
# Should return: {"ok":true}

# Clean up
docker container stop your-framework-benchmark
docker container rm your-framework-benchmark
docker rmi your-framework-benchmark:1.0.0
```

## Requirements

### Endpoint Specification

Your server **must** implement:

- **Path**: `/ping`
- **Method**: `GET`
- **Response**: JSON object `{"ok": true}`
- **Status Code**: `200`
- **Port**: `3000` (inside container)

### Performance Considerations

For fair benchmarking:

1. **Minimal Logic**: Keep the endpoint implementation simple
2. **No External Dependencies**: Avoid database calls, external APIs, etc.
3. **Production Mode**: Use production-optimized settings when possible
4. **Single Process**: Run as a single process (no clustering) for consistency

## Running Benchmarks

Once added, run all benchmarks:

```bash
cd benchmarks/backend
./start.sh
```

This will automatically:
- Build your framework's Docker image
- Run all k6 tests against it
- Generate reports with your framework name

## Results

Results will be saved with your framework name:
- `results/json/your-framework-summary-latency_[timestamp].json`
- `results/html/your-framework-report-latency_[timestamp].html`

## Troubleshooting

### Container Won't Start

- Check Docker logs: `docker logs your-framework-benchmark`
- Verify the server starts correctly locally
- Ensure port 3000 is exposed in Dockerfile

### Connection Refused

- Verify the server binds to `0.0.0.0` (not `localhost` or `127.0.0.1`)
- Check that port 3000 is exposed in the Dockerfile
- Ensure the server is listening before the container starts

### Build Failures

- Check dependency installation
- Verify build commands in Dockerfile
- Test the Dockerfile build process manually
