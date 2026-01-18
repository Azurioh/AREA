import { Action, Reaction, type Service } from './_definitions';
import { ServiceManager } from './_manager/service.manager';
import { createGithubService } from './github';
import { createDiscordService } from './discord';
import { createSpotifyService } from './spotify';
import { createUnsplashService } from './unsplash';
import { createDropboxService } from './dropbox';
import { createTwitchService } from './twitch';
import { createNasaService } from './nasa';

export {
  createGithubService,
  createDiscordService,
  createSpotifyService,
  createUnsplashService,
  createDropboxService,
  createTwitchService,
  createNasaService,
  ServiceManager,
  Action,
  Reaction,
  type Service,
};
