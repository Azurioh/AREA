import type { CreateAction, CreateReaction, MeActionsReactions } from '@area/shared/schemas/action-reaction.schema';
import type { ActionsReactionsRepository } from './actions-reactions.repository';
import type { ActionPayload, ActionsReactions } from '@/types/action-reaction';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';
import type { GithubService } from '../github';
import type { DiscordService } from '../discord';

/**
 * @class ActionsReactionsService
 * @description The actions reactions service.
 */
export class ActionsReactionsService {
  private readonly repository: ActionsReactionsRepository;
  private actionsCreationFunc: Map<string, (userId: string, action: CreateAction) => Promise<string>>;
  private reactionsCreationFunc: Map<string, (userId: string, action: CreateReaction) => Promise<boolean>>;

  constructor(repository: ActionsReactionsRepository, githubService: GithubService, discordService: DiscordService) {
    this.repository = repository;
    this.actionsCreationFunc = new Map([
      ['github', githubService.createAction.bind(githubService)],
      ['discord', discordService.createAction.bind(discordService)],
    ]);
    this.reactionsCreationFunc = new Map([
      ['github', githubService.createReaction.bind(githubService)],
      ['discord', discordService.createReaction.bind(discordService)],
    ]);
  }

  /**
   * @function handleActions
   * @description handle the redirection of action creation
   *
   * @param {string} userId The id of the user creating the action reaction
   * @param {CreateAction} action The information about the action to be created
   * @returns {Promise<string>} The trigger action to store in the db
   */
  async handleActions(userId: string, action: CreateAction): Promise<string> {
    const actionCreationFunc = this.actionsCreationFunc.get(action.service);

    if (!actionCreationFunc) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "Requested service doesn't exist");
    }
    return await actionCreationFunc(userId, action);
  }

  /**
   * @function handleReactions
   * @description handle the redirection of reaction creation
   *
   * @param {ActionPayload} action The information about the reaction to be created
   * @returns {Promise<void>} Nothing
   */
  async handleReactions(action: ActionPayload): Promise<void> {
    const actionsReactions = await this.getActionsReactionsByTrigger(action.trigger);

    for (const actionReaction of actionsReactions) {
      const reactionCreationFunc = this.reactionsCreationFunc.get(actionReaction.reaction.service);

      if (!reactionCreationFunc) {
        continue;
      }
      await reactionCreationFunc(actionReaction.userId, actionReaction.reaction);
    }
  }

  /**
   * @function createActionReaction
   * @description Create a new action reaction
   *
   * @param {string} userId The id of the user creating the action reaction
   * @param {CreateAction} action The information about the action to be created
   * @param {CreateReaction} reaction The information about the reaction to be created
   * @returns {Promise<boolean>} If the action and reaction could be created
   */
  async createActionReaction(userId: string, action: CreateAction, reaction: CreateReaction): Promise<void> {
    const trigger = await this.handleActions(userId, action);

    const data: ActionsReactions = {
      userId: userId,
      action: action,
      reaction: reaction,
      trigger: trigger,
    };
    await this.repository.createActionReaction(data);
  }

  /**
   * @function getActionsReactionsByTrigger
   * @description Get the list of actions reactions matching the action trigger
   *
   * @param {string} trigger The trigger of the action
   * @returns {Promise<ActionsReactions[]>} The matched actions reactions
   */
  async getActionsReactionsByTrigger(trigger: string): Promise<ActionsReactions[]> {
    return await this.repository.getActionsReactionsByTrigger(trigger);
  }

  /**
   * @function getMeActionsReactions
   * @description Get the list of actions reactions for the current user
   *
   * @param {string} userId The id of the user
   * @returns {Promise<MeActionsReactions[]>} The matched actions reactions
   */
  async getMeActionsReactions(trigger: string): Promise<MeActionsReactions> {
    const actionsReactions = await this.repository.getMeActionsReactions(trigger);

    const formattedActionsReactions: MeActionsReactions = actionsReactions.map((actionReaction) => {
      return {
        action: actionReaction.action,
        reaction: actionReaction.reaction,
      };
    });
    return formattedActionsReactions;
  }
}
