import { Action, Reaction, type Service } from './_definitions';
import { ServiceManager } from './_manager/service.manager';
import { createGithubService } from './github';
import { createDiscordService } from './discord';
import { createSpotifyService } from './spotify';
import { createUnsplashService } from './unsplash';
import { createDropboxService } from './dropbox';

export {
  createGithubService,
  createDiscordService,
  createSpotifyService,
  createUnsplashService,
  createDropboxService,
  ServiceManager,
  Action,
  Reaction,
  type Service,
};
