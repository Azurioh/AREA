import type { Service } from '@/integrations/_definitions/service.interface';
import * as actions from './actions';
import * as reactions from './reactions';

export const githubService: Service = {
  name: 'GitHub',
  actions: Object.values(actions).map((Action) => new Action()),
  reactions: Object.values(reactions).map((Reaction) => new Reaction()),
};
