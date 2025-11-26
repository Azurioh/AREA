/**
 * @interface ActionParams
 * @description The parameters of an action
 *
 * @property {string} key - The key of the parameter
 * @property {string} label - The label of the parameter
 * @property {string} placeholder - The placeholder of the parameter
 * @property {string[]} options - The options of the parameter
 */
export type ActionParams =
  | {
      type: 'input';
      key: string;
      label: string;
      placeholder: string;
    }
  | {
      type: 'select';
      key: string;
      label: string;
      placeholder: string;
      options: string[];
    };

/**
 * @interface ReturnValues
 * @description The return values of an action
 *
 * @property {string} key - The key of the return value
 * @property {string} description - The description of the return value
 * @property {string} type - The type of the return value
 * @property {string} path - The path of the return value
 */
export type ReturnValues = {
  key: string;
  description: string;
  type: string;
  path: string;
};

/**
 * @interface IAction
 * @description The interface of an action
 *
 * @property {string} name - The name of the action
 * @property {string} description - The description of the action
 * @property {ActionParams[]} params - The parameters of the action
 * @property {ReturnValues[]} returnedValues - The return values of the action
 */
export interface IAction {
  readonly name: string;
  readonly description: string;
  params: ActionParams[];
  readonly returnedValues: ReturnValues[];

  /**
   * @function refreshParams
   * @description Refresh the parameters of the action
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  refreshParams(userId: string): Promise<void>;
}

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
  readonly returnedValues: ReturnValues[];

  constructor(name: string, description: string, params: ActionParams[], returnedValues: ReturnValues[]) {
    this.name = name;
    this.description = description;
    this.params = params;
    this.returnedValues = returnedValues;
  }

  abstract refreshParams(userId: string): Promise<void>;
}
