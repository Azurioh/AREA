import { Action, Reaction, type Service } from './_definitions';
import { ServiceManager } from './_manager/service.manager';
import { createGithubService } from './github';
import { createDiscordService } from './discord';
import { createSpotifyService } from './spotify';

export {
  createGithubService,
  createDiscordService,
  createSpotifyService,
  ServiceManager,
  Action,
  Reaction,
  type Service,
};
