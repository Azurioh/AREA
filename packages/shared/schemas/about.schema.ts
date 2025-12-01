import z from 'zod';
import { aboutServiceSchema } from '../types/about.types';

export const aboutResponseSchema = z.object({
  client: z.object({
    host: z.string().meta({
      description: 'Client host',
      example: '127.0.0.1',
    }),
  }),
  server: z.object({
    current_time: z.number().positive().meta({
      description: 'Server current time',
      example: Date.now(),
    }),
    services: aboutServiceSchema,
  }),
});

/**
 * @type AboutResponse
 * @description Response of the about route
 */
export type AboutResponse = z.infer<typeof aboutResponseSchema>;
