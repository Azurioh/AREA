import { z } from 'zod';

export const listGithubRepositoriesResponseSchema = z.array(
  z.string().meta({
    description: 'Repository name',
    example: 'area',
  }),
);
