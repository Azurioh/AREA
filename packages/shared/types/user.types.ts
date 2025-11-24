import z from 'zod';
import { DysType, UserRoles } from '../enums/user-enums';

export const userFields = {
  name: z.string().min(1).max(200).meta({
    description: 'User name',
    example: 'John Doe',
  }),
  email: z.email().meta({
    description: 'User email',
    example: 'john.doe@example.com',
  }),
  password: z.string().meta({
    description: 'User password (hashed)',
    example: 'pbkdf2$sha256$150000$...',
  }),
  role: z.enum(UserRoles).meta({
    description: 'User role',
    example: UserRoles.ADMIN,
  }),
  darkModeEnabled: z.boolean().meta({
    description: 'User dark mode enabled',
    example: true,
  }),
  dyslexiaType: z.enum(DysType).meta({
    description: 'User dyslexia type',
    example: DysType.DYSLEXIA,
  }),
  createdAt: z.date().meta({
    description: 'User creation date',
    example: '2025-01-01T00:00:00.000Z',
  }),
  updatedAt: z.date().meta({
    description: 'User update date',
    example: '2025-01-01T00:00:00.000Z',
  }),
};

export const userSchema = z.object(userFields);

/**
 * @type User
 * @description User type
 */
export type User = z.infer<typeof userSchema>;

export const accessTokenSchema = z.object({
  _id: z.string().meta({
    description: 'The user id',
    example: '679d3c8b4b8c9d3c8b4b8c9d',
  }),
  darkModeEnabled: userFields.darkModeEnabled,
  dyslexiaType: userFields.dyslexiaType,
});

export type AccessToken = z.infer<typeof accessTokenSchema>;
