# Frontend Testing Documentation

This document explains the testing strategy, configuration, and best practices for the frontend application (`apps/frontend`).

## Technology Stack

-   **Test Runner**: [Jest](https://jestjs.io/)
-   **Testing Library**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) (for component integration tests)
-   **TypeScript Support**: `ts-jest`
-   **Environment**: `jest-environment-jsdom` (simulates a browser environment)

## Configuration

The testing setup is composed of several key files:

### 1. `jest.config.ts`
The main configuration file. It sets up:
-   **Preset**: Uses `ts-jest` for handling TypeScript files.
-   **Environment**: Sets `testEnvironment` to `jsdom`.
-   **Path Aliases**: Maps `@/*` to `src/*` and `@area/shared` to the shared package, matching `tsconfig`.
-   **Transformations**: Configures `ts-jest` to use a specific `tsconfig.test.json`.
-   **Static Assets**: Mocks images, fonts, and media files to avoid parsing errors.

### 2. `src/setupTests.ts`
Runs before each test suite. It includes:
-   **DOM Matchers**: Imports `@testing-library/jest-dom` to provide matchers like `toBeInTheDocument()`.
-   **Polyfills**: Adds polyfills for browser APIs missing in JSDOM, such as `TextEncoder`, `TextDecoder`, `ResizeObserver`, and `matchMedia`.

### 3. `tsconfig.test.json`
A specific TypeScript configuration for tests that overrides settings from `tsconfig.app.json` to ensure compatibility with Jest (which runs in Node.js and often requires CommonJS modules).

## Running Tests

You can run tests using the scripts defined in `package.json`:

```bash
# Run all tests
pnpm test

# Run tests in watch mode (re-runs on save)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run a specific test file
pnpm test src/features/auth/__tests__/routes/LoginPage.test.tsx
```

## Writing Tests

We support both Unit Tests and Component/Integration Tests.

### Unit Tests (Logic & Hooks)
Used for testing business logic, API clients, and custom hooks.

#### Step-by-Step Guide: Writing a Unit Test

1.  **Identify the Subject**: Determine if you are testing a pure function, a class, or a React hook.
2.  **Create the Test File**: Create a file named `SubjectName.test.ts` (or `.tsx`) in the `__tests__` directory.
3.  **Setup Mocks**:
    -   Use `jest.mock()` to mock external modules.
    -   Use `beforeEach()` to reset mocks or setup initial state.
4.  **Write Test Cases**:
    -   Use `describe()` to group related tests.
    -   Use `it()` or `test()` to define individual test cases.
    -   **Arrange**: Prepare inputs and mocks.
    -   **Act**: Call the function or method under test.
    -   **Assert**: Check the results using `expect()`.

#### Example: Testing an API Client (`AuthClient.test.ts`)

```typescript
import { AuthClient } from '@/features/auth/api/AuthClient';

// 1. Mock dependencies
global.fetch = jest.fn();

describe('AuthClient', () => {
    let client: AuthClient;

    // 2. Setup before each test
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
        client = new AuthClient('http://api.test', {} as any);
    });

    // 3. Define a test case
    it('login() calls the correct endpoint', async () => {
        // Arrange
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: '123' }),
        });

        // Act
        await client.login({ email: 'test@test.com', password: '123' });

        // Assert
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/auth/login'),
            expect.objectContaining({ method: 'POST' })
        );
    });
});
```

#### Example: Testing a Custom Hook (`useLogin.test.ts`)

Testing hooks requires `renderHook` and `act` from RTL because hooks cannot run outside a component.

```typescript
import { renderHook, act } from '@testing-library/react';
import { useLogin } from '../useLogin';

// Mock dependencies used by the hook
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('useLogin', () => {
    it('updates email state', () => {
        const { result } = renderHook(() => useLogin());

        act(() => {
            result.current.setEmail('new@test.com');
        });

        expect(result.current.email).toBe('new@test.com');
    });
});
```

### Component Tests (Integration)
Used for verifying UI components and interactions.

**Example: `LoginPage.test.tsx`**
-   **Rendering**: Use `render` from `@testing-library/react`.
-   **Wrappers**: Wrap components in necessary providers (e.g., `<BrowserRouter>`).
-   **Mocking**:
    -   **Hooks**: Mock business logic hooks (e.g., `useLogin`) to isolate UI testing from logic.
    -   **Libraries**: Mock creating complex libraries like `framer-motion` if they cause JSDOM issues.
-   **Interaction**: Use `fireEvent` or `userEvent` to simulate user actions.

```typescript
// Example: Mocking a hook
jest.mock('@/features/auth/hooks/useLogin');
(useLogin as jest.Mock).mockReturnValue({ ... });

// Example: Assertions
expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
```

## Common Issues & Solutions

-   **"toBeInTheDocument is not a function"**: Ensure `import '@testing-library/jest-dom'` is in `src/setupTests.ts` and `jest.config.ts` includes it in `setupFilesAfterEnv`.
-   **"TextEncoder is not defined"**: This is a missing Node.js global in JSDOM. It is polyfilled in `src/setupTests.ts`.
-   **Static Asset Errors** (e.g., `import logo from './logo.png'`): Jest cannot parse binary files. These are mocked via `moduleNameMapper` in `jest.config.ts` pointing to `src/__mocks__/fileMock.js`.
