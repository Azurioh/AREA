import type { IAction, IReaction, ReactionParams } from '@area/shared/types/services.types';

/**
 * @class Reaction
 * @description The reaction class
 *
 * @property {string} name - The name of the reaction
 * @property {string} description - The description of the reaction
 * @property {ReactionParams[]} params - The parameters of the reaction
 */
export abstract class Reaction implements IReaction {
  readonly name: string;
  readonly description: string;
  params: ReactionParams[];

  constructor(name: string, description: string, params: ReactionParams[]) {
    this.name = name;
    this.description = description;
    this.params = params;
  }

  /**
   * @function parseActionVariables
   * @description Parse the reaction elements with the action content
   *
   * @param {IAction} action The action triggered
   * @param {Record<string, any>} actionContent The content of the action triggered
   * @param {string[]} inputs The inputs to parse
   * @returns {string[]} The parsed inputs
   */
  parseActionVariables(action: IAction, actionContent: Record<string, any>, inputs: string[]): string[] {
    const replaceValues = action.returnedValues.map((key) => ({
      key,
      value: actionContent[key.path],
    }));

    return inputs.map((input) => {
      for (const replaceValue of replaceValues) {
        input.replace(new RegExp(`$\{${replaceValue.key}}`, 'g'), replaceValue.value);
      }
      return input;
    });
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the reaction
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
