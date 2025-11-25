import { z } from 'zod';

export const uptimeResponseSchema = z.object({
  uptime: z.number().meta({
    description: 'Uptime in seconds',
    example: 123456,
  }),
});
