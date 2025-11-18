import { check, sleep } from 'k6';
import http from 'k6/http';
import { Trend } from 'k6/metrics';
import { generateSummary } from './utils/summary.js';

const rpsTrend = new Trend('rps_trend');

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const serverUrl = __ENV.SERVER_URL || 'http://host.docker.internal:3001/ping';
  const response = http.get(serverUrl);

  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  rpsTrend.add(response.timings.duration);
  sleep(1);
}

export function handleSummary(data) {
  return generateSummary(data, 'resource');
}
