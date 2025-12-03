import { actionParamsSchema, actionReturnValuesFields, reactionParamsSchema } from '@area/shared/types/services.types';
import z from 'zod';

/**
 * GET /services/v1/:serviceName/actions
 */
export const getServiceActionsParamsSchema = z.object({
  service: z.string().meta({
    description: 'The name of the service',
    example: 'GitHub',
  }),
});

export type GetServiceActionsParams = z.infer<typeof getServiceActionsParamsSchema>;

export const getServiceActionsResponseSchema = z.array(
  z.object({
    name: z.string().meta({
      description: 'The name of the action',
      example: 'Create Issue',
    }),
    description: z.string().meta({
      description: 'A brief description of the action',
      example: 'Creates a new issue in the specified repository',
    }),
  }),
);

/**
 * GET /services/v1/:serviceName/actions/:actionName
 */
export const getActionDetailsParamsSchema = z.object({
  service: z.string().meta({
    description: 'The name of the service',
    example: 'GitHub',
  }),
  action: z.string().meta({
    description: 'The name of the action',
    example: 'Create Issue',
  }),
});

export type GetActionsDetailsParams = z.infer<typeof getActionDetailsParamsSchema>;

export const getActionsDetailsResponseSchema = z.object({
  name: z.string().meta({
    description: 'The name of the action',
    example: 'Create Issue',
  }),
  description: z.string().meta({
    description: 'A brief description of the action',
    example: 'Creates a new issue in the specified repository',
  }),
  params: z.array(actionParamsSchema),
});

/**
 * GET /services/v1/:serviceName/actions/:actionName/returned-values
 */
export const getActionReturnedValuesParamsSchema = z.object({
  service: z.string().meta({
    description: 'The name of the service',
    example: 'GitHub',
  }),
  action: z.string().meta({
    description: 'The name of the action',
    example: 'Create Issue',
  }),
});

export type GetActionReturnedValuesParams = z.infer<typeof getActionReturnedValuesParamsSchema>;

export const getActionReturnedValuesResponseSchema = z.array(
  z.object({
    key: actionReturnValuesFields.key,
    description: actionReturnValuesFields.description,
    type: actionReturnValuesFields.type,
  }),
);

/**
 * GET /services/v1/:serviceName/reactions
 */
export const getServiceReactionsParamsSchema = z.object({
  service: z.string().meta({
    description: 'The name of the service',
    example: 'GitHub',
  }),
});

export type GetServiceReactionsParams = z.infer<typeof getServiceReactionsParamsSchema>;

export const getServiceReactionsResponseSchema = z.array(
  z.object({
    name: z.string().meta({
      description: 'The name of the reaction',
      example: 'Post Comment',
    }),
    description: z.string().meta({
      description: 'A brief description of the reaction',
      example: 'Posts a comment on the specified issue',
    }),
  }),
);

/**
 * GET /services/v1/:serviceName/reactions/:reactionName
 */
export const getReactionDetailsParamsSchema = z.object({
  service: z.string().meta({
    description: 'The name of the service',
    example: 'GitHub',
  }),
  reaction: z.string().meta({
    description: 'The name of the reaction',
    example: 'Post Comment',
  }),
});

export type GetReactionDetailsParams = z.infer<typeof getReactionDetailsParamsSchema>;

export const getReactionDetailsResponseSchema = z.object({
  name: z.string().meta({
    description: 'The name of the reaction',
    example: 'Post Comment',
  }),
  description: z.string().meta({
    description: 'A brief description of the reaction',
    example: 'Posts a comment on the specified issue',
  }),
  params: z.array(reactionParamsSchema),
});
