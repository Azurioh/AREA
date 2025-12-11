export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        diagnostics: {
          ignoreCodes: [1343],
          warnOnly: true,
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { env: { VITE_BACKEND_URL: 'http://localhost:3000' } } },
            },
          ],
        },
      },
    ],
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@area/shared$': '<rootDir>/../../packages/shared/index.ts',
    '^@area/shared/(.*)$': '<rootDir>/../../packages/shared/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
