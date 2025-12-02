import z from 'zod';

export const actionParamsFields = {
  key: z.string().meta({
    description: 'The key of the parameter',
    example: 'email',
  }),
  label: z.string().meta({
    description: 'The label of the parameter',
    example: 'Email Address',
  }),
  placeholder: z.string().meta({
    description: 'The placeholder of the parameter',
    example: 'Enter your email address',
  }),
  inputType: z.literal('input').meta({
    description: 'The type of the parameter',
    example: 'input',
  }),
  selectType: z.literal('select').meta({
    description: 'The type of the parameter',
    example: 'select',
  }),
  options: z.array(z.string()).meta({
    description: 'The options of the parameter (only for select type)',
    example: ['option1', 'option2', 'option3'],
  }),
};

export const actionParamsSchema = z
  .object({
    key: actionParamsFields.key,
    label: actionParamsFields.label,
    placeholder: actionParamsFields.placeholder,
  })
  .and(
    z.object({ type: actionParamsFields.inputType }).or(
      z.object({
        type: actionParamsFields.selectType,
        options: actionParamsFields.options,
      }),
    ),
  );

/**
 * @type ActionParams
 * @description The type of the action parameters
 *
 * @property {string} key - The key of the parameter
 * @property {string} label - The label of the parameter
 * @property {string} placeholder - The placeholder of the parameter
 * @property {'input' | 'select'} type - The type of the parameter
 * @property {string[]} [options] - The options of the parameter (only for select type)
 */
export type ActionParams = z.infer<typeof actionParamsSchema>;

export const actionReturnValuesFields = {
  key: z.string().meta({
    description: 'The key of the return value',
    example: 'userId',
  }),
  description: z.string().meta({
    description: 'The description of the return value',
    example: 'The ID of the user',
  }),
  type: z.string().meta({
    description: 'The type of the return value',
    example: 'string',
  }),
  path: z.string().meta({
    description: 'The path of the return value',
    example: 'data.user.id',
  }),
};

export const actionReturnValuesSchema = z.object({
  key: actionReturnValuesFields.key,
  description: actionReturnValuesFields.description,
  type: actionReturnValuesFields.type,
  path: actionReturnValuesFields.path,
});

/**
 * @type ActionReturnValues
 * @description The type of the action return values
 *
 * @property {string} key - The key of the return value
 * @property {string} description - The description of the return value
 * @property {string} type - The type of the return value
 * @property {string} path - The path of the return value
 */
export type ActionReturnValues = z.infer<typeof actionReturnValuesSchema>;

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
  readonly returnedValues: ActionReturnValues[];

  /**
   * @function refreshParams
   * @description Refresh the parameters of the action
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  refreshParams(userId: string): Promise<void>;
}

export const reactionParamsFields = {
  key: z.string().meta({
    description: 'The key of the parameter',
    example: 'email',
  }),
  label: z.string().meta({
    description: 'The label of the parameter',
    example: 'Email Address',
  }),
  placeholder: z.string().meta({
    description: 'The placeholder of the parameter',
    example: 'Enter your email address',
  }),
  inputType: z.literal('input').meta({
    description: 'The type of the parameter',
    example: 'input',
  }),
  selectType: z.literal('select').meta({
    description: 'The type of the parameter',
    example: 'select',
  }),
  options: z.array(z.string()).meta({
    description: 'The options of the parameter (only for select type)',
    example: ['option1', 'option2', 'option3'],
  }),
};

export const reactionParamsSchema = z
  .object({
    key: actionParamsFields.key,
    label: actionParamsFields.label,
    placeholder: actionParamsFields.placeholder,
  })
  .and(
    z.object({ type: actionParamsFields.inputType }).or(
      z.object({
        type: actionParamsFields.selectType,
        options: actionParamsFields.options,
      }),
    ),
  );

export type ReactionParams = z.infer<typeof reactionParamsSchema>;

/**
 * @interface IReaction
 * @description The interface of a reaction
 *
 * @property {string} name - The name of the reaction
 * @property {string} description - The description of the reaction
 * @property {ReactionParams[]} params - The parameters of the reaction
 */
export interface IReaction {
  readonly name: string;
  readonly description: string;
  params: ReactionParams[];

  /**
   * @function refreshParams
   * @description Refresh the parameters of the reaction
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  refreshParams(userId: string): Promise<void>;

  /**
   * @function parseActionVariables
   * @description Parse the reaction elements with the action content
   *
   * @param {IAction} action The action triggered
   * @param {Record<string, any>} actionContent The content of the action triggered
   * @param {string[]} inputs The inputs to parse
   * @returns {string[]} The parsed inputs
   */
  parseActionVariables(action: IAction, actionContent: Record<string, any>, inputs: string[]): string[];
}
