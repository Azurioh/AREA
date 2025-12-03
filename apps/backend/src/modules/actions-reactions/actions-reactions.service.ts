import { CreateAction, CreateReaction } from "@area/shared/schemas/action-reaction.schema";
import { ActionsReactionsRepository } from "./actions-reactions.repository";
import { ActionPayload, ActionsReactions } from "@/types/action-reaction";
import { HttpStatusCode } from "@area/shared/enums/http-status";
import ApiError from "@/utils/api-error";
import { GithubService } from "../github";

/**
 * @class ActionsReactionsService
 * @description The actions reactions service.
 */
export class ActionsReactionsService {
	private readonly repository: ActionsReactionsRepository;
  private actionsCreationFunc: Map<string, (userId: string, action: Omit<CreateAction, 'trigger'>) => Promise<string>>;
  private reactionsCreationFunc: Map<string, (userId: string, action: CreateReaction) => Promise<boolean>>;

	constructor(repository: ActionsReactionsRepository, githubService: GithubService) {
		this.repository = repository;
		this.actionsCreationFunc = new Map([
			['github', githubService.createAction.bind(githubService)]
		]);
		this.reactionsCreationFunc = new Map([
			['github', githubService.createReaction.bind(githubService)]
		]);
	}

	/**
	 * @function handleActions
	 * @description handle the redirection of action creation
	 *
	 * @param {string} userId The id of the user creating the action reaction
	 * @param {Omit<CreateAction, 'trigger'>} action The information about the action to be created
	 * @returns {Promise<string>} The trigger action to store in the db
	 */
	async handleActions(userId: string, action: Omit<CreateAction, 'trigger'>): Promise<string> {
		const actionCreationFunc = this.actionsCreationFunc.get(action.service);

		if (!actionCreationFunc) {
			throw new ApiError(HttpStatusCode.NOT_FOUND, 'Requested service doesn\'t exist')
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
			await reactionCreationFunc(actionReaction.userId, actionReaction.reaction)
		}
	}

	/**
	 * @function createActionReaction
	 * @description Create a new action reaction
	 *
	 * @param {string} userId The id of the user creating the action reaction
	 * @param {Omit<CreateAction, 'trigger'>} action The information about the action to be created
	 * @param {CreateReaction} reaction The information about the reaction to be created
	 * @returns {Promise<boolean>} If the action and reaction could be created
	 */
	async createActionReaction(userId: string, action: Omit<CreateAction, 'trigger'>, reaction: CreateReaction): Promise<void> {
		const trigger = await this.handleActions(userId, action);

		const data: ActionsReactions = {
			userId: userId,
			action: {...action, trigger},
			reaction: reaction
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
}
