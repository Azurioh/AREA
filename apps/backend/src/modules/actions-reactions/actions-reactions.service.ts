import { HttpStatusCode } from '@area/shared/enums/http-status';
import type {
  CreateAction,
  CreateReaction,
  GetMeActionsReactions,
} from '@area/shared/schemas/actions-reactions.schema';
import type { DiscordService } from '@/modules/discord';
import type { GithubService } from '@/modules/github';
import type { ActionPayload, ActionReaction } from '@/types/action-reaction';
import ApiError from '@/utils/api-error';
import type { ActionsReactionsRepository } from './actions-reactions.repository';
import type { WithId } from 'mongodb';

/**
 * @class ActionsReactionsService
 * @description The actions reactions service.
 */
export class ActionsReactionsService {
  private readonly repository: ActionsReactionsRepository;
  private actionsCreationFunc: Map<string, (userId: string, action: CreateAction) => Promise<string>>;
  private reactionsCreationFunc: Map<
    string,
    (userId: string, reaction: CreateReaction, action: ActionPayload) => Promise<boolean>
  >;

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
      if (!actionReaction.executionState) {
        continue;
      }

      const reactionCreationFunc = this.reactionsCreationFunc.get(actionReaction.reaction.service);

      if (!reactionCreationFunc) {
        continue;
      }
      if (await reactionCreationFunc(actionReaction.userId, actionReaction.reaction, action)) {
        await this.repository.incrementActionReactionExecution(actionReaction._id.toString());
      }
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

    const data: ActionReaction = {
      userId: userId,
      action: action,
      reaction: reaction,
      trigger: trigger,
      numberOfExecution: 0,
      executionState: true,
    };
    await this.repository.createActionReaction(data);
  }

  /**
   * @function getActionsReactionsByTrigger
   * @description Get the list of actions reactions matching the action trigger
   *
   * @param {string} trigger The trigger of the action
   * @returns {Promise<WithId<ActionReaction>[]>} The matched actions reactions
   */
  async getActionsReactionsByTrigger(trigger: string): Promise<WithId<ActionReaction>[]> {
    return await this.repository.getActionsReactionsByTrigger(trigger);
  }

  /**
   * @function getMeActionsReactions
   * @description Get the list of actions reactions for the current user
   *
   * @param {string} userId The id of the user
   * @returns {Promise<GetMeActionsReactions[]>} The matched actions reactions
   */
  async getMeActionsReactions(trigger: string): Promise<GetMeActionsReactions> {
    const actionsReactions = await this.repository.getMeActionsReactions(trigger);

    const formattedActionsReactions: GetMeActionsReactions = actionsReactions.map((actionReaction) => {
      return {
        _id: actionReaction._id.toString(),
        action: actionReaction.action,
        reaction: actionReaction.reaction,
        numberOfExecution: actionReaction.numberOfExecution,
        executionState: actionReaction.executionState,
      };
    });
    return formattedActionsReactions;
  }

  /**
   * @function updateActionReactionExecutionStateById
   * @description Update the action reaction execution state by id
   *
   * @param {string} id The id of the action reaction
   * @param {string} executionState The execution state of the action reaction
   * @returns {Promise<void[]>} The matched actions reactions
   */
  async updateActionReactionExecutionStateById(id: string, executionState: boolean): Promise<void> {
    const updated = await this.repository.updateActionReactionExecutionStateById(id, executionState);

    if (!updated.acknowledged) {
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'Failed to update the execution state, please contact an administrator',
      );
    }

    if (updated.matchedCount === 0) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Action reaction not found');
    }
  }
}
