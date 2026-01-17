import z from 'zod';

/*************************************
 * GET THIRD PARTY AUTHORIZATION URL *
 *************************************/

export const getThirdPartyAuthorizationUrlResponseSchema = z.object({
  url: z.string().meta({
    description: 'The url to authorize the user ',
    example: 'https://your-authorization-url.com/',
  }),
});

export type GetThirdPartyAuthorizationUrlResponse = z.infer<typeof getThirdPartyAuthorizationUrlResponseSchema>;

export const getThirdPartyAuthorizationUrlParamsSchema = z.object({
  service: z.string().meta({
    description: 'The name of the third party service',
    example: 'github',
  }),
});

/**
 * @type GetThirdPartyAuthorizationUrlParams
 * @description The params for the get user me third party authorization url endpoint
 */
export type GetThirdPartyAuthorizationUrlParams = z.infer<typeof getThirdPartyAuthorizationUrlParamsSchema>;

/*********************
 * AUTHORIZE SERVICE *
 *********************/

export const thirdPartyAuthorizationParamsSchema = z.object({
  service: z.string().meta({
    description: 'The name of the service',
    example: 'github',
  }),
});

export const thirdPartyAuthorizationQueryStringSchema = z.object({
  code: z.string().meta({
    description: 'The code provided by the service to authenticate the user',
    example: '679d8c9b3c9b3c9b3c9b3c9b',
  }),
  state: z.string().meta({
    description: 'A random string to protect against attacks',
    example: 'afd8ff98879jkfdkf',
  }),
});

export const thirdPartyAuthorizationResponseSchema = z.object({});

/**************************
 * GET THIRD PARTY STATUS *
 **************************/

export const getThirdPartyStatusResponseSchema = z.object({
  connected: z.boolean().meta({
    description: 'If the user is connected to the third party service',
  }),
});

/**
 * @type GetThirdPartyStatusResponse
 * @description The response for the get third party status endpoint
 */
export type GetThirdPartyStatusResponse = z.infer<typeof getThirdPartyStatusResponseSchema>;

export const getThirdPartyStatusParamsSchema = z.object({
  service: z.string().meta({
    description: 'The name of the service ',
    example: 'github',
  }),
});

/**
 * @type GetThirdPartyStatusParams
 * @description The params for the get third party status endpoint
 */
export type GetThirdPartyStatusParams = z.infer<typeof getThirdPartyStatusParamsSchema>;
