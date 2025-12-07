import type { Action, Reaction, Service } from './_definitions';
import { ServiceManager } from './_manager/service.manager';
import { createGithubService } from './github';
import { createDiscordService } from './discord';

export { createGithubService, createDiscordService, ServiceManager, type Action, type Reaction, type Service };
