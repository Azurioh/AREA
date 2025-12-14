import type { CreateAction, CreateReaction } from '@area/shared/schemas/actions-reactions.schema';

/**
 * @type ActionsReactions
 * @description The format of a action reaction in the db
 *
 * @property {string} userId The id of the user creating the action reaction
 * @property {CreateAction} action The data to create the action
 * @property {CreateReaction} reaction The data to create the reaction
 * @property {string} trigger The action trigger that result in the reaction
 * @property {string} numberOfExecution The number of times the action reaction have been executed
 */
export type ActionsReactions = {
  userId: string;
  action: CreateAction;
  reaction: CreateReaction;
  trigger: string;
  numberOfExecution: number;
};

/**
 * @type DiscordAuthorizationQueryString
 * @description Query string required to authenticate with discord.
 *
 * @property {string} service The service that issued the action
 * @property {string} trigger The trigger that made the action
 */
export type ActionPayload = {
  service: string;
  trigger: string;
};
