import type { Action, Reaction, Service } from './_definitions';
import serviceManager from './_manager/service.manager';
import { createGithubService } from './github';
import { getGithubClient } from './github/client';

export { getGithubClient, createGithubService, serviceManager, type Action, type Reaction, type Service };
