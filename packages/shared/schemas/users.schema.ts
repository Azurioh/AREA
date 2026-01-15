import { userFields, userSchema } from '@area/shared/types/users.types';
import z from 'zod';

/***************
 * GET USER ME *
 ***************/

export const getUserMeResponseSchema = userSchema.omit({ password: true });

export type GetUserMeResponse = z.infer<typeof getUserMeResponseSchema>;

/******************
 * UPDATE USER ME *
 ******************/

export const updateUserMeBodySchema = z
  .object({
    name: userFields.name,
    darkModeEnabled: userFields.darkModeEnabled,
    dyslexiaEnabled: userFields.dyslexiaEnabled,
  })
  .partial();

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

/*****************
 * GET ALL USERS *
 *****************/

export const getAllUsersResponseSchema = userSchema
  .omit({ password: true })
  .and(
    z.object({
      _id: z.string().meta({
        description: 'The id of the user',
        example: '1897894387843',
      }),
    }),
  )
  .array();

export type GetAllUsers = z.infer<typeof getAllUsersResponseSchema>;

/******************
 * GET USER BY ID *
 ******************/

export const getUserByIdParamsSchema = z.object({
  id: z.string().meta({
    description: 'The id of the user',
    example: '679d8c9b3c9b3c9b3c9b3c9b',
  }),
});

export const getUserByIdResponseSchema = userSchema.omit({ password: true });

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
  dyslexiaEnabled: userFields.dyslexiaEnabled,
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
