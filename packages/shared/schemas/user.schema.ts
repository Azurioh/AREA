import z from 'zod';
import { userFields, userSchema } from '../types/user.types';

/******************
 * GET USER BY ID *
 ******************/

export const getUserByIdParamsSchema = z.object({
  id: z.string().meta({
    description: 'The id of the user',
    example: '679d8c9b3c9b3c9b3c9b3c9b',
  }),
});

/**
 * @type GetUserByIdParams
 * @description The parameters for the get user by id endpoint
 */
export type GetUserByIdParams = z.infer<typeof getUserByIdParamsSchema>;

export const getUserByIdResponseSchema = userSchema.omit({ password: true });

/***************
 * GET USER ME *
 ***************/

export const getUserMeResponseSchema = userSchema.omit({ password: true });

/******************
 * UPDATE USER ME *
 ******************/

export const updateUserMeBodySchema = z.object({
  darkModeEnabled: userFields.darkModeEnabled,
  dyslexiaType: userFields.dyslexiaType,
});

/**
 * @type UpdateUserMeBody
 * @description The body for the update user me endpoint
 */
export type UpdateUserMeBody = z.infer<typeof updateUserMeBodySchema>;

export const updateUserMeResponseSchema = z.object({});

/******************
 * DELETE USER ME *
 ******************/

export const deleteUserMeResponseSchema = z.object({});
