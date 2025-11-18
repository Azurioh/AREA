# How to Add a New Test

This guide explains how to add a new k6 test script to the benchmark suite.

## Test File Structure

Create a new JavaScript file in `benchmarks/backend/k6/` with the following structure:

```javascript
import http from "k6/http";
import { generateSummary } from "./utils/summary.js";

export const options = {
    // Your test configuration
};

export default function () {
    // Your test logic
    http.get("http://host.docker.internal:3001/ping");
}

export function handleSummary(data) {
    return generateSummary(data, "your-test-name");
}
```

## Required Components

### 1. Options Configuration

The `options` object defines your test parameters. Common configurations:

**Fixed Virtual Users:**
```javascript
export const options = {
    vus: 100,           // Number of virtual users
    duration: "60s",    // Test duration
};
```

**Ramping Virtual Users (Stages):**
```javascript
export const options = {
    stages: [
        { duration: "10s", target: 10 },   // Ramp up to 10 users
        { duration: "30s", target: 50 },   // Stay at 50 users
        { duration: "10s", target: 0 },    // Ramp down to 0
    ],
};
```

**Custom Metrics:**
```javascript
import { Trend, Counter, Rate } from "k6/metrics";

const myTrend = new Trend("my_trend");
const myCounter = new Counter("my_counter");
const myRate = new Rate("my_rate");

export const options = {
    vus: 50,
    duration: "30s",
};
```

### 2. Test Function

The `default` function is executed by each virtual user. This is where you make HTTP requests:

```javascript
export default function () {
    const response = http.get("http://host.docker.internal:3001/ping");

    // Optional: Add assertions
    check(response, {
        "status is 200": (r) => r.status === 200,
        "response time < 500ms": (r) => r.timings.duration < 500,
    });

    // Optional: Add sleep between requests
    sleep(1);
}
```

### 3. Summary Handler

Always use `generateSummary` to ensure consistent report generation:

```javascript
export function handleSummary(data) {
    return generateSummary(data, "your-test-name");
}
```

The second parameter (`"your-test-name"`) will be used in the output filenames.

## Example: Adding a Spike Test

Here's a complete example of a spike test that rapidly increases load:

```javascript
import http from "k6/http";
import { generateSummary } from "./utils/summary.js";

export const options = {
    stages: [
        { duration: "10s", target: 100 },   // Normal load
        { duration: "1s", target: 1000 },   // Spike to 1000 users
        { duration: "10s", target: 100 },    // Back to normal
        { duration: "1s", target: 1000 },   // Another spike
        { duration: "10s", target: 0 },     // Cool down
    ],
};

export default function () {
    http.get("http://host.docker.internal:3001/ping");
}

export function handleSummary(data) {
    return generateSummary(data, "spike");
}
```

Save this as `benchmarks/backend/k6/spike.js`.

## Test Types to Consider

- **Spike Test**: Sudden increases in load
- **Volume Test**: Large amounts of data
- **Endurance Test**: Extended duration with steady load
- **Scalability Test**: Progressive load increases
- **Capacity Test**: Finding maximum throughput

## Best Practices

1. **Use Descriptive Names**: Name your test file and summary type clearly
2. **Start Small**: Begin with lower virtual user counts and shorter durations
3. **Add Sleep**: Use `sleep()` between requests to simulate real user behavior
4. **Use Checks**: Add assertions to validate responses
5. **Monitor Resources**: Consider system limitations when setting high virtual user counts

## Running Your New Test

Once added, your new test will automatically run when you execute:

```bash
cd benchmarks/backend
./start.sh
```

Or run it individually:

```bash
docker run -i --rm \
    -v $(pwd):/k6 \
    --network host \
    -e SERVER_NAME=express \
    grafana/k6 run /k6/k6/your-test-name.js
```
