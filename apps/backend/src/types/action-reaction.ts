import type { CreateAction, CreateReaction } from '@area/shared/schemas/actions-reactions.schema';

/**
 * @type ActionReaction
 * @description The format of an action reaction in the db
 *
 * @property {string} userId The id of the user creating the action reaction
 * @property {CreateAction} action The data to create the action
 * @property {CreateReaction} reaction The data to create the reaction
 * @property {string} trigger The action trigger that result in the reaction
 * @property {string} numberOfExecution The number of times the action reaction have been executed
 * @property {boolean} executionState If the action reaction should be executed
 */
export type ActionReaction = {
  userId: string;
  action: CreateAction;
  reaction: CreateReaction;
  trigger: string;
  numberOfExecution: number;
  executionState: boolean;
};

/**
 * @type ActionPayload
 * @description The payload of an action.
 *
 * @property {string} service The service that issued the action
 * @property {string} name The name of the issued action
 * @property {string} trigger The trigger that made the action
 * @property {Record<string, any>} content The content of the action
 */
export type ActionPayload = {
  service: string;
  name: string;
  trigger: string;
  content: Record<string, any>;
};
