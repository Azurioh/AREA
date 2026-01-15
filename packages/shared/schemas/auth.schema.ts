import z from 'zod';
import { userFields } from '../types/users.types';

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

export const registerHeadersSchema = z.looseObject({
  'content-type': z.literal('application/json').meta({
    description: 'The content type of the request body',
  }),
  'x-admin-secret': z.string().optional().meta({
    description: 'The admin secret',
    example: 'secret',
  }),
  'x-client-type': z.enum(['web', 'mobile']).optional().meta({
    description: 'The client type (web or mobile)',
    example: 'web',
  }),
});

export type RegisterHeaders = z.infer<typeof registerHeadersSchema>;

export const registerBodyResponseSchema = z.object({
  accessToken: z.string().meta({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }),
  refreshToken: z
    .string()
    .meta({
      description: 'Refresh token',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
    .or(z.undefined()),
});

export type RegisterResponse = z.infer<typeof registerBodyResponseSchema>;

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

export const loginHeadersSchema = z.looseObject({
  'content-type': z.literal('application/json').meta({
    description: 'The content type of the request body',
  }),
  'x-client-type': z.enum(['web', 'mobile']).optional().meta({
    description: 'The client type (web or mobile)',
    example: 'web',
  }),
});

export type LoginHeaders = z.infer<typeof loginHeadersSchema>;

export const loginBodyResponseSchema = z.object({
  accessToken: z.string().meta({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }),
  refreshToken: z
    .string()
    .meta({
      description: 'Refresh token',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
    .or(z.undefined()),
});

export type LoginResponse = z.infer<typeof loginBodyResponseSchema>;

export const refreshTokenHeadersSchema = z.looseObject({
  'x-client-type': z.enum(['web', 'mobile']).optional().meta({
    description: 'The client type (web or mobile)',
    example: 'web',
  }),
});

export type RefreshTokenHeaders = z.infer<typeof refreshTokenHeadersSchema>;

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string().meta({
    description: 'New access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }),
});

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

export const logoutBodySchema = z.object({
  refreshToken: z.string().min(1).trim().meta({
    description: 'The refresh token of the user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }),
});

export type LogoutBody = z.infer<typeof logoutBodySchema>;

export const logoutResponseSchema = z.object({});

export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
