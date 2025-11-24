import z from 'zod';
import { userFields } from '../types/user.types';

/************
 * REGISTER *
 ************/

export const registerBodySchema = z.object({
  name: userFields.name,
  email: userFields.email,
  password: userFields.password,
});

/**
 * @type RegisterUserBody
 * @description Body required to register a user.
 */
export type RegisterBody = z.infer<typeof registerBodySchema>;

export const registerBodyResponseSchema = z.object({
  accessToken: z.string().meta({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }),
  refreshToken: z.string().meta({
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }),
});

/*********
 * LOGIN *
 *********/
export const loginBodySchema = z.object({
  email: userFields.email,
  password: userFields.password,
  rememberMe: z.boolean().meta({
    description: 'Remember me',
    example: true,
  }),
});

/**
 * @type LoginUserBody
 * @description Body required to login a user.
 */
export type LoginBody = z.infer<typeof loginBodySchema>;

export const loginBodyResponseSchema = z.object({
  accessToken: z.string().meta({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }),
  refreshToken: z.string().meta({
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }),
});
