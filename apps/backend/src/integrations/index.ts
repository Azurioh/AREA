import type { ActionParams, IAction, IReaction, ReactionParams, ReturnValues } from './_definitions';
import { ServiceManager } from './_manager/service.manager';
import { GithubService } from './github';
import { getGithubClient } from './github/client';

export {
  getGithubClient,
  GithubService,
  ServiceManager,
  type ActionParams,
  type ReturnValues,
  type IAction,
  type IReaction,
  type ReactionParams,
};
