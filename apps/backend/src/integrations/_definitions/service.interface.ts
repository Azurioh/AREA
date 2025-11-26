import type { IAction } from './action.interface';
import type { IReaction } from './reaction.interface';

/**
 * @interface Service
 * @description The service interface
 *
 * @property {string} name - The name of the service
 * @property {IAction[]} actions - The actions of the service
 * @property {IReaction[]} reactions - The reactions of the service
 */
export interface Service {
  name: string;
  actions: IAction[];
  reactions: IReaction[];
}
