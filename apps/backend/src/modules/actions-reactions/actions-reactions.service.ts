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
import { ObjectId, type WithId } from 'mongodb';
import type { SpotifyService } from '@/modules/spotify';
import type { UnsplashService } from '@/modules/unsplash';
import type { DropboxService } from '@/modules/dropbox';
import type { TwitchService } from '../twitch/twitch.service';
import { ServiceManager } from '@/integrations';
import type { IAction, IReaction } from '@area/shared/types/services.types';

/**
 * @class ActionsReactionsService
 * @description The actions reactions service.
 */
export class ActionsReactionsService {
  private readonly repository: ActionsReactionsRepository;
  private actionsCreationFunc: Map<
    string,
    (actionReactionId: string, userId: string, action: CreateAction) => Promise<string>
  >;
  private reactionsCreationFunc: Map<
    string,
    (userId: string, reaction: CreateReaction, action: ActionPayload) => Promise<boolean>
  >;
  private actionReceptionFunc: Map<string, (action: ActionPayload) => Promise<ActionPayload[]>>;
  private actionDeletionFunc: Map<string, (actionReaction: WithId<ActionReaction>) => Promise<void>>;

  constructor(
    repository: ActionsReactionsRepository,
    githubService: GithubService,
    discordService: DiscordService,
    spotifyService: SpotifyService,
    unsplashService: UnsplashService,
    dropboxService: DropboxService,
    twitchService: TwitchService,
  ) {
    this.repository = repository;
    this.actionsCreationFunc = new Map([
      ['github', githubService.createAction.bind(githubService)],
      ['discord', discordService.createAction.bind(discordService)],
      ['spotify', spotifyService.createAction.bind(spotifyService)],
      ['unsplash', unsplashService.createAction.bind(unsplashService)],
      ['dropbox', dropboxService.createAction.bind(dropboxService)],
      ['twitch', twitchService.createAction.bind(twitchService)],
    ]);
    this.reactionsCreationFunc = new Map([
      ['github', githubService.createReaction.bind(githubService)],
      ['discord', discordService.createReaction.bind(discordService)],
      ['spotify', spotifyService.createReaction.bind(spotifyService)],
    ]);
    this.actionReceptionFunc = new Map([['dropbox', dropboxService.actionReception.bind(dropboxService)]]);
    this.actionDeletionFunc = new Map([
      ['spotify', spotifyService.deleteAction.bind(spotifyService)],
      ['unsplash', unsplashService.deleteAction.bind(unsplashService)],
    ]);
  }

  /**
   * @function handleActions
   * @description handle the redirection of action creation
   *
   * @param {string} actionReactionId The id of the action reaction document
   * @param {string} userId The id of the user creating the action reaction
   * @param {CreateAction} action The information about the action to be created
   * @returns {Promise<string>} The trigger action to store in the db
   */
  async handleActions(actionReactionId: string, userId: string, action: CreateAction): Promise<string> {
    const actionCreationFunc = this.actionsCreationFunc.get(action.service);

    if (!actionCreationFunc) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "Requested service doesn't exist");
    }
    return await actionCreationFunc(actionReactionId, userId, action);
  }

  /**
   * @function handleActionReception
   * @description handle the reception of an action
   *
   * @param {ActionPayload} action The payload of the action
   * @returns {Promise<void>} Nothing
   */
  async handleActionReception(action: ActionPayload): Promise<void> {
    const actionReceptionFunc = this.actionReceptionFunc.get(action.service);

    if (actionReceptionFunc) {
      for (const newAction of await actionReceptionFunc(action)) {
        this.handleReactions(newAction);
      }
    } else {
      this.handleReactions(action);
    }
  }

  /**
   * @function handleReactions
   * @description handle the redirection of reaction creation
   *
   * @param {ActionPayload} action The information about the reaction to be created
   * @returns {Promise<void>} Nothing
   */
  async handleReactions(action: ActionPayload): Promise<void> {
    const actionsReactions: WithId<ActionReaction>[] = await this.repository.getActionsReactionsByTrigger(
      action.trigger,
    );

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
   * @function validateActionOrReactionParams
   * @description Validate the params of an action or a reaction
   *
   * @param {any} params The params to validate
   * @returns {void} Nothing
   */
  private validateActionOrReactionParams(type: 'Action' | 'Reaction', params: any, paramsToValidate: any): void {
    if (typeof paramsToValidate !== 'object') {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, `${type} is invalid`);
    }
    for (const param of params) {
      if (Object.hasOwn(paramsToValidate as Object, param.key)) {
        if (param.type === 'input') {
          continue;
        }
        if (
          param.type === 'select' &&
          typeof paramsToValidate[param.key] === 'object' &&
          Object.hasOwn(paramsToValidate[param.key] as Object, 'name') &&
          Object.hasOwn(paramsToValidate[param.key] as Object, 'id')
        ) {
          continue;
        }
      }
      throw new ApiError(HttpStatusCode.BAD_REQUEST, `${type} is invalid`);
    }
  }

  /**
   * @function validateActionReaction
   * @description Validate if the action and reaction are compatible
   *
   * @param {CreateAction} action The action to validate
   * @param {CreateReaction} reaction The reaction to validate
   * @returns {void} Nothing
   */
  private validateActionReaction(actionToValidate: CreateAction, reactionToValidate: CreateReaction): void {
    const actionService = ServiceManager.instance.get(actionToValidate.service);
    const reactionService = ServiceManager.instance.get(reactionToValidate.service);

    if (!actionService || !reactionService) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Service not found');
    }

    const action = actionService.actions.find((value: IAction) => value.name === actionToValidate.name);
    const reaction = reactionService.reactions.find((value: IReaction) => value.name === reactionToValidate.name);

    if (!action) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Action not found');
    }
    this.validateActionOrReactionParams('Action', action.params, actionToValidate.params);

    if (!reaction) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Reaction not found');
    }
    this.validateActionOrReactionParams('Reaction', reaction.params, reactionToValidate.params);
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
    this.validateActionReaction(action, reaction);

    const actionReactionId = new ObjectId();
    const trigger = await this.handleActions(actionReactionId.toString(), userId, action);

    const data: WithId<ActionReaction> = {
      _id: actionReactionId,
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
   * @param {boolean} executionState The execution state of the action reaction
   * @returns {Promise<void[]>} Nothing
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

  /**
   * @function deleteActionReactionById
   * @description Delete the action reaction by id
   *
   * @param {string} id The id of the action reaction
   * @returns {Promise<void>} Nothing
   */
  async deleteActionReactionById(id: string): Promise<void> {
    const actionReaction = await this.repository.getActionsReactionsById(id);

    if (!actionReaction) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Action reaction not found');
    }

    const actionDeletionFunc = this.actionDeletionFunc.get(actionReaction.action.service);

    if (actionDeletionFunc) {
      await actionDeletionFunc(actionReaction);
    }

    const deleted = await this.repository.deleteActionReactionById(id);

    if (!deleted.acknowledged) {
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'Failed to delete the action reaction, please contact an administrator',
      );
    }

    if (deleted.deletedCount === 0) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Action reaction not found');
    }
  }
}
