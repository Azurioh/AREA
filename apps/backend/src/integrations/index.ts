import type { Action, Reaction, Service } from './_definitions';
import { ServiceManager } from './_manager/service.manager';
import { createGithubService } from './github';
import { discordService } from './discord';

export { createGithubService, discordService, ServiceManager, type Action, type Reaction, type Service };
