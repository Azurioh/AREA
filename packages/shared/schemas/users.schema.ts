import z from 'zod';
import { userFields, userSchema } from '../types/user.types';

/************************
 * CREATE USER ME STATE *
 ************************/

export const createUserMeStateTokenResponseSchema = z.object({
  stateToken: z.string().meta({
    description: 'The oauth state token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }),
});

export const getUserByIdResponseSchema = userSchema.omit({ password: true });

/***************
 * GET USER ME *
 ***************/

export const getUserMeResponseSchema = userSchema.omit({ password: true });

export type GetUserMeResponse = z.infer<typeof getUserMeResponseSchema>;

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

/*********************
 * UPDATE USER BY ID *
 *********************/

export const updateUserByIdParamsSchema = z.object({
  id: z.string().meta({
    description: 'The id of the user',
    example: '679d8c9b3c9b3c9b3c9b3c9b',
  }),
});

/**
 * @type UpdateUserByIdParams
 * @description The parameters for the update user by id endpoint
 */
export type UpdateUserByIdParams = z.infer<typeof updateUserByIdParamsSchema>;

export const updateUserByIdBodySchema = z.object({
  name: userFields.name,
  email: userFields.email,
  darkModeEnabled: userFields.darkModeEnabled,
  dyslexiaType: userFields.dyslexiaType,
});

/**
 * @type UpdateUserByIdBody
 * @description The body for the update user by id endpoint
 */
export type UpdateUserByIdBody = z.infer<typeof updateUserByIdBodySchema>;

export const updateUserByIdResponseSchema = z.object({});

/*********************
 * DELETE USER BY ID *
 *********************/

export const deleteUserByIdParamsSchema = z.object({
  id: z.string().meta({
    description: 'The id of the user',
    example: '679d8c9b3c9b3c9b3c9b3c9b',
  }),
});

/**
 * @type DeleteUserByIdParams
 * @description The parameters for the delete user by id endpoint
 */
export type DeleteUserByIdParams = z.infer<typeof deleteUserByIdParamsSchema>;

export const deleteUserByIdResponseSchema = z.object({});
