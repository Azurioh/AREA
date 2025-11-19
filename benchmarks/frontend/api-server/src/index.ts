import express from 'express';
import { v4 } from 'uuid';

const app = express();

app.get('/ping', (_req, res) => {
  res.json({ ok: true });
});

app.get('/data/:nb', (req, res) => {
  const data = [];
  const { nb } = req.params;

  if (!nb || Number.isNaN(Number.parseInt(nb, 10))) {
    return [];
  }

  for (let i = 0; i < Number.parseInt(nb, 10); i++) {
    data.push({ id: i, value: v4(), type: Math.random() > 0.5 ? 'A' : 'B' });
  }

  res.status(200).json(data);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
