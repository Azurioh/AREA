import type { Service } from '@/integrations/_definitions/service.interface';
import * as actions from './actions';
import * as reactions from './reactions';
import type { GithubService } from '@/modules/github';

export const createGithubService = (githubService: GithubService): Service => {
  return {
    name: 'GitHub',
    actions: Object.values(actions).map((Action) => new Action(githubService)),
    reactions: Object.values(reactions).map((Reaction) => new Reaction(githubService)),
  };
};
