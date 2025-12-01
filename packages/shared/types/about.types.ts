import { z } from 'zod';

export const aboutServiceSchema = z.array(
  z.object({
    name: z.string().meta({
      description: 'Service name',
      example: 'GitHub',
    }),
    actions: z.array(
      z.object({
        name: z.string().meta({
          description: 'Action name',
          example: 'Get repositories',
        }),
        description: z.string().meta({
          description: 'Action description',
          example: 'Get repositories from GitHub',
        }),
      }),
    ),
    reactions: z.array(
      z.object({
        name: z.string().meta({
          description: 'Reaction name',
          example: 'Update repositories',
        }),
        description: z.string().meta({
          description: 'Reaction description',
          example: 'Update repositories from GitHub',
        }),
      }),
    ),
  }),
);

/**
 * @type AboutServiceType
 * @description Data sended by the about route about services
 */
export type AboutServiceType = z.infer<typeof aboutServiceSchema>;
