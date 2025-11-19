import { check, sleep } from 'k6';
import http from 'k6/http';
import { generateSummary } from './utils/summary.js';

export const options = {
  stages: [
    { duration: '20s', target: 50 },
    { duration: '20s', target: 200 },
    { duration: '20s', target: 500 },
  ],
};

export default function () {
  const serverUrl = __ENV.SERVER_URL || 'http://host.docker.internal:3001/ping';
  const response = http.get(serverUrl);

  check(response, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

export function handleSummary(data) {
  return generateSummary(data, 'load');
}
