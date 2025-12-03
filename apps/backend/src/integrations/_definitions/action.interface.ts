import type { ActionParams, ActionReturnValues, IAction } from '@area/shared/types/services.types';

/**
 * @class Action
 * @description The action class
 *
 * @property {string} name - The name of the action
 * @property {string} description - The description of the action
 * @property {ActionParams[]} params - The parameters of the action
 * @property {ReturnValues[]} returnedValues - The return values of the action
 */
export abstract class Action implements IAction {
  readonly name: string;
  readonly description: string;
  params: ActionParams[];
  readonly returnedValues: ActionReturnValues[];

  constructor(name: string, description: string, params: ActionParams[], returnedValues: ActionReturnValues[]) {
    this.name = name;
    this.description = description;
    this.params = params;
    this.returnedValues = returnedValues;
  }

  abstract refreshParams(userId: string): Promise<void>;
}
