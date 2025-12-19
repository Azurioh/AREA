import type { IAction, IReaction, ReactionParams } from '@area/shared/types/services.types';
import { ServiceManager } from '../_manager/service.manager';
import type { ActionPayload } from '@/types/action-reaction';

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
   * @param {Omit<ActionPayload, 'trigger'>} issuedAction The issued action
   * @param {string[]} inputs The inputs to parse
   * @returns {string[]} The parsed inputs
   */
  static parseActionVariables(issuedAction: Omit<ActionPayload, 'trigger'>, inputs: string[]): string[] {
    const action = ServiceManager.instance
      .get(issuedAction.service)
      ?.actions.find((value: IAction) => value.name === issuedAction.name);

    if (!action) {
      return inputs;
    }

    const getValueInObject = (object: Record<string, any>, path: string): any => {
      const splitted = path.split('.');

      if (splitted.length === 1 && splitted[0]) {
        return object[splitted[0]];
      } else if (splitted.length >= 2 && splitted[0]) {
        return getValueInObject(object[splitted[0]], splitted.slice(1, splitted.length).join());
      }
      return undefined;
    };

    const replaceValues = action.returnedValues.map((key) => ({
      key,
      value: getValueInObject(issuedAction.content, key.path),
    }));

    return inputs.map((input) => {
      for (const replaceValue of replaceValues) {
        input = input.replaceAll(`$\{${replaceValue.key.key}}`, replaceValue.value);
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
