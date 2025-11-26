import { z } from 'zod';

export const listGithubRepositoriesResponseSchema = z.array(
  z.string().meta({
    description: 'Repository name',
    example: 'area',
  }),
);

export const githubAuthenticationQueryStringSchema = z.object({
  code: z.string().meta({
    description: 'The code provided by Github to authenticate the user',
    example: '679d8c9b3c9b3c9b3c9b3c9b',
  }),
  state: z.string().meta({
    description: 'A random string to protect against attacks',
    example: 'afd8ff98879jkfdkf',
  })
});

export const githubAuthenticationResponseSchema = z.object({});
