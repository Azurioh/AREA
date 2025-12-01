import type { ActionParams, IAction, IReaction, ReactionParams, ReturnValues } from './_definitions';
import serviceManager from './_manager/service.manager';
import { githubService } from './github';
import { getGithubClient } from './github/client';

export {
  getGithubClient,
  githubService,
  serviceManager,
  type ActionParams,
  type ReturnValues,
  type IAction,
  type IReaction,
  type ReactionParams,
};
