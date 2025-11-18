import { check, sleep } from 'k6';
import http from 'k6/http';
import { generateSummary } from './utils/summary.js';

export const options = {
  vus: 100,
  duration: '1h',
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
  return generateSummary(data, 'soak');
}
