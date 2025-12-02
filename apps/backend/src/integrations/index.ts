import type { Action, Reaction, Service } from './_definitions';
import serviceManager from './_manager/service.manager';
import { githubService } from './github';
import { getGithubClient } from './github/client';

export { getGithubClient, githubService, serviceManager, type Action, type Reaction, type Service };
