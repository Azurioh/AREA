import type { Action, Reaction, Service } from './_definitions';
import { ServiceManager } from './_manager/service.manager';
import { githubService } from './github';
import { discordService } from './discord';

export { githubService, discordService, ServiceManager, type Action, type Reaction, type Service };
