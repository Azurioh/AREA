import z from 'zod';

export const actionReactionSchema = z.object({
  service: z.string().meta({
    description: 'The service related to the action/reaction',
    example: 'github',
  }),
  name: z.string().meta({
    description: 'The name of the action/reaction',
    example: 'push',
  }),
  params: z.object({}).catchall(z.any()),
});

export type CreateAction = z.infer<typeof actionReactionSchema>;

export type CreateReaction = z.infer<typeof actionReactionSchema>;

/**********************************
 * CREATE ACTION REACTION *
 **********************************/

export const createActionReactionBodySchema = z.object({
  action: actionReactionSchema,
  reaction: actionReactionSchema,
});

export type CreateActionReactionBody = z.infer<typeof createActionReactionBodySchema>;

export const createActionReactionResponseSchema = z.object({});

/****************************
 * GET ME ACTIONS REACTIONS *
 ****************************/

export const getMeActionsReactionsResponseSchema = z.array(
  z.object({
    action: actionReactionSchema,
    reaction: actionReactionSchema,
    numberOfExecution: z.number().meta({
      description: 'The number of execution of the workflow',
      example: 14,
    }),
  }),
);

export type GetMeActionsReactions = z.infer<typeof getMeActionsReactionsResponseSchema>;
