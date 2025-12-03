import type { IAction, IReaction } from '@area/shared/types/services.types';

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
