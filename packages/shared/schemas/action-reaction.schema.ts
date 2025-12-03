import z from "zod";

export const actionReactionSchema = z.object({
  service: z.string().meta({
    description: 'The service related to the action/reaction',
    example: 'github',
  }),
  name: z.string().meta({
    description: 'The name of the action/reaction',
    example: 'push',
  }),
  params: z.object({}).catchall(z.any())
})


export type CreateAction = z.infer<typeof actionReactionSchema> & {
    trigger: string
};

export type CreateReaction = z.infer<typeof actionReactionSchema>;

/**********************************
 * CREATE ACTION REACTION *
 **********************************/

export const createUserMeActionReactionBodySchema = z.object({
  action: actionReactionSchema,
  reaction: actionReactionSchema
});

export type CreateUserMeActionReactionBody = z.infer<typeof createUserMeActionReactionBodySchema>;

export const createUserMeActionReactionResponseSchema = z.object({});
