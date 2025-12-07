import { z } from 'zod';

export const githubAuthorizationQueryStringSchema = z.object({
  code: z.string().optional().meta({
    description: 'The code provided by Github to authenticate the user',
    example: '679d8c9b3c9b3c9b3c9b3c9b',
  }),
  state: z.string().meta({
    description: 'A random string to protect against attacks',
    example: 'afd8ff98879jkfdkf',
  }),
});

export const githubAuthorizationResponseSchema = z.object({});
