# Backend Testing Documentation

This document explains the testing strategy, configuration, and best practices for the backend application (`apps/backend`).

## Technology Stack

-   **Framework**: [Fastify](https://www.fastify.io/)
-   **Test Runner**: [Jest](https://jestjs.io/)
-   **E2E Testing**: [Supertest](https://github.com/ladjs/supertest)
-   **TypeScript Support**: `ts-jest`
-   **Environment**: Node.js

## Configuration

### 1. `jest.config.js`
-   Sets the test environment to `node`.
-   Configures `ts-jest` for TypeScript compilation.
-   Maps path aliases (e.g., `@/*` -> `src/*`) to match `tsconfig.json`.
-   Ignores `node_modules` except for specific ESM packages (like `uuid`).

### 2. `jest.setup.ts`
Runs before test suites to:
-   Load environment variables from `.env.test`.
-   Mock the global configuration module (`src/utils/environment`) to ensure consistent test values (e.g., test DB URI, secret keys).

## Running Tests

Tests are run using the scripts in `package.json`:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage
```

## Writing Tests

We support both Unit Tests and E2E/Integration Tests.

### Unit Tests (Services & Controllers)
Used to test business logic in isolation by mocking dependencies (like databases or repositories).

#### Step-by-Step Guide: Writing a Unit Test

1.  **Identify Subject**: Usually a Service class (e.g., `AuthService`).
2.  **Create Test File**: `Subject.test.ts` in `__tests__`.
3.  **Mock Dependencies**: Create mock objects for any classes/repositories the subject depends on.
4.  **Inject Mocks**: Pass the mocks to the subject's constructor.

#### Example: Testing a Service (`auth.service.test.ts`)

```typescript
import { AuthService } from '../auth.service';
import { UsersRepository } from '@/modules/users';

describe('AuthService', () => {
  let service: AuthService;
  let mockRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    // 1. Create a mock repository object
    mockRepository = {
      createUser: jest.fn(),
      getUserByEmail: jest.fn(),
      // ...other methods
    } as any;

    // 2. Inject mock into service
    service = new AuthService(mockRepository);
  });

  it('registerUser() creates a new user', async () => {
    // Arrange
    const newUser = { email: 'test@test.com', password: '123' };
    mockRepository.createUser.mockResolvedValueOnce({ acknowledged: true } as any);

    // Act
    await service.registerUser(newUser as any);

    // Assert
    expect(mockRepository.createUser).toHaveBeenCalled();
  });
});
```

### Integration / E2E Tests (Routes)
Used to test the entire request/response cycle, including middleware and database interactions.

**Note**: These tests connect to a **real MongoDB instance** (usually a local test DB). Ensure your `.env.test` is configured correctly.

#### Step-by-Step Guide: Writing an E2E Test

1.  **Setup App**: Use `beforeAll` to build and ready the Fastify app.
2.  **Teardown**: Use `afterAll` to close the app and database connections.
3.  **Request**: Use `supertest` (imported as `request`) to send HTTP requests to `app.server`.
4.  **Cleanup**: Clean up any data created in the DB during the test to avoid pollution.

#### Example: Testing a Route (`auth.routes.test.ts`)

```typescript
import build from '@/app';
import request from 'supertest';

describe('Auth Routes', () => {
  let app: FastifyInstance;

  // 1. Start App
  beforeAll(async () => {
    app = await build();
    await app.ready();
  });

  // 2. Close App
  afterAll(async () => {
    await app.close();
  });

  it('POST /register returns 201', async () => {
    // 3. Send Request
    const response = await request(app.server)
      .post('/auth/v1/register')
      .send({ email: 'new@test.com', password: '123' });

    expect(response.status).toBe(201);
  });
});
```

## Best Practices

1.  **Mocking**: Always mock external services (Discord, GitHub, Mailer) in unit tests.
2.  **Database**: For E2E tests, helper functions like `removeValueFromDatabase` are available in `@/utils/db-cleaner` to clean up data after tests.
3.  **Environment**: Never use production credentials. The `jest.setup.ts` file automatically mocks sensitive env vars for you.
