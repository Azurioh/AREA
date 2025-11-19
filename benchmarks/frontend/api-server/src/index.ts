import express from 'express';
import { v4 } from 'uuid';

const app = express();

app.get('/ping', (_req, res) => {
  res.json({ ok: true });
});

app.get('/data', (_req, _res) => {
  const data = [];

  for (let i = 0; i < 100; i++) {
    data.push({ id: i, value: v4(), type: Math.random() > 0.5 ? 'A' : 'B' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
