import z from 'zod';
import { userFields } from '../types/users.types';
import { thirdPartyAuthorizationParamsSchema, thirdPartyAuthorizationQueryStringSchema } from './third-parties.schema';

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
  email: userFields.email.nonoptional(),
  password: userFields.password.nonoptional(),
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

export const loginResponseSchema = z.object({
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

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string().meta({
    description: 'New access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }),
});

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

/**********************
 * LOGIN WITH SERVICE *
 **********************/

export const loginWithServiceParamsSchema = thirdPartyAuthorizationParamsSchema;

/**
 * @type LoginWithServiceParams
 * @description Params required to login with a third party service.
 *
 * @property {string} service The service to login with
 */
export type LoginWithServiceParams = z.infer<typeof loginWithServiceParamsSchema>;

export const loginWithServiceQueryStringSchema = thirdPartyAuthorizationQueryStringSchema;

/**
 * @type LoginWithServiceQueryString
 * @description Query string required to login with a third party service.
 *
 * @property {string} code The code provided by the service to authenticate the user
 * @property {string} state A state given by the client when making the authorization request
 */
export type LoginWithServiceQueryString = z.infer<typeof loginWithServiceQueryStringSchema>;

export const loginWithServiceResponseSchema = loginResponseSchema;
