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

export const getThirdPartyAuthorizationUrlParamsSchema = z.object({
  provider: z.string().meta({
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
  code: z.string().optional().meta({
    description: 'The code provided by the service to authenticate the user',
    example: '679d8c9b3c9b3c9b3c9b3c9b',
  }),
  state: z.string().meta({
    description: 'A random string to protect against attacks',
    example: 'afd8ff98879jkfdkf',
  }),
});

export const thirdPartyAuthorizationResponseSchema = z.object({});
