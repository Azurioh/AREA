import z from 'zod';

export const refreshTokenValidatorSchema = z.object({
  userId: z.string().min(1).trim().meta({
    description: 'The ID of the user associated with the refresh token.',
    example: '64b8f0c2e1d3f2a5b6c7d8e9',
  }),
  hashedToken: z.string().min(1).trim().meta({
    description: 'The refresh token hashed used for obtaining new access tokens.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  }),
  expiresAt: z.date().meta({
    description: 'The expiration date and time of the refresh token.',
    example: '2024-12-31T23:59:59.000Z',
  }),
});

export type RefreshTokenValidator = z.infer<typeof refreshTokenValidatorSchema>;
