# Contributing to the Monorepo Project

This document outlines the process for contributing to the project. We operate within a **Monorepo** structure hosting a **Fastify** backend, a **React** frontend, and a **Kotlin** mobile application.

## Keep the code clean

### 1\. Naming & Case Conventions

Since we mix technologies, conventions vary slightly between the Web/Backend (TypeScript) and Mobile (Kotlin).

**A. TypeScript (React & Fastify)**

| Kind of identifier | Case | Example |
| :--- | :--- | :--- |
| **Variables / Functions / Methods** | `camelCase` | `userCount`, `fetchData()` |
| **Classes / Interfaces / Types / Enums** | `PascalCase` | `UserController`, `IUser`, `AuthStatus` |
| **React Components** | `PascalCase` | `UserProfile.tsx`, `NavBar.tsx` |
| **Global Constants** | `UPPER_SNAKE_CASE` | `MAX_RETRY_ATTEMPTS`, `API_URL` |
| **File Names** | `kebab-case` (except React Components) | `user-utils.ts`, `auth.routes.ts` |
| **React Component Files** | `PascalCase` | `SubmitButton.tsx` |

**B. Kotlin (Mobile)**

| Kind of identifier | Case | Example |
| :--- | :--- | :--- |
| **Variables / Functions / Methods** | `camelCase` | `userCount`, `onCreate()` |
| **Classes / Interfaces / Objects** | `PascalCase` | `NetworkManager`, `MainActivity` |
| **Compose Functions (UI)** | `PascalCase` | `UserCard()`, `ScreenLayout()` |
| **Const vals / Enum constants** | `UPPER_SNAKE_CASE` | `TIMEOUT_MS`, `ERROR_NOT_FOUND` |
| **XML Resource IDs** | `snake_case` | `tv_user_name`, `activity_main` |

### 2\. Formatting

Automation is key. Do not argue about style in code reviews; let the linters do the work.

  * **TypeScript**: We use **Biome**.
      * Indent with **2 spaces**.
      * Single quotes `'` prefered over double quotes (unless in JSX).
      * Semi-colons are mandatory.

**General Rules:**

  * **Line Length**: Keep it under 100 characters where possible (120 hard limit).
  * **Braces**: Open braces on the same line (`if (...) {`).
  * **No unused imports**: Configure your IDE to optimize imports on save.

### 3\. Structure & Readability

  * **Small Functions**: Aim for functions $\le$ 40 lines. If a React component or a Fastify controller grows too large, extract logic into custom hooks or service layers.
  * **Early Returns**: Avoid "Arrow Code". Return as soon as a negative condition is met.
  * **Strong Typing**:
      * **TS**: Usage of `any` is **strictly forbidden**. Define interfaces or types for all data structures.
      * **Kotlin**: Avoid `!!` (non-null assertions). Use safe calls `?.` or `let` blocks.
  * **React Specifics**:
      * Prefer **Functional Components** with Hooks over Class components.
      * Logic should be separated from UI (View) via Custom Hooks or Context.
  * **Fastify Specifics**:
      * Keep Controllers thin; move business logic to Services.
      * Use Schemas for request/response validation.
  * **Comments**: Explain *why*, not *what*. Code should be self-documenting.

### 4\. Consistency & Monorepo Etiquette

  * **Don't Repeat Yourself (DRY)**:
      * If a type or utility is used by both the Backend and the Frontend, it **must** be moved to `packages/shared`. Do not duplicate code.
  * **State Management**: Follow the established pattern (e.g., React Context/Zustand for Web, ViewModel/Flow for Kotlin). Do not introduce new state libraries without discussion.

### 5\. Imports

  * **Ordering**:
    1.  External libraries (e.g., `react`, `fastify`, `retrofit`).
    2.  Internal Monorepo Packages (e.g., `@project/shared`, `@project/ui-kit`).
    3.  Relative/Local imports.
  * **TypeScript**: Use absolute imports (Aliases) where configured (e.g., `import X from '@/components/X'`) instead of deep relative paths (`../../components/X`).

-----

## Using Git

We use Git linked with Jira. Access is required to contribute.

### 1\. Use branches

Branches are usually created via Jira automation or must follow the naming convention:

```bash
git checkout -b <jira-task-id>-<short-description>
# Example: git checkout -b PROJ-42-implement-login
```

### 2\. Commit your changes

We strictly follow [Conventional Commits](https://www.conventionalcommits.org/).

**Header Format**: `type(scope): subject`

| Type | Description |
| :--- | :--- |
| `feat` | A new feature (e.g., adding a new route, new screen) |
| `fix` | A bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting, missing semi-colons, etc. (no code change) |
| `test` | Adding or correcting tests |
| `chore` | Build process, dependency updates, config changes |

**Scope examples**: `backend`, `frontend`, `mobile`, `packages`.

**Example Commit:**

```text
feat(frontend): add biometric authentication

Implemented fingerprint login using BiometricPrompt API.
Fallbacks to PIN if biometric is unavailable.

Jira task: PROJ-42
```

### 3\. Submitting your changes

  * **Pull Request (PR)**: The title must include the Jira ID.
      * *Example*: `[PROJ-42] Add biometric auth to mobile`
  * **CI/CD**: All PRs trigger the CI pipeline (Lint, Build, Test). A red pipeline means **no merge**.
  * **Review**: You need at least **2 approvals**, including one from the specific domain lead (e.g., Mobile Lead for Kotlin changes).

### 4\. Merging

  * **Squash and Merge**: We squash commits to keep the main history clean.
  * **Message**: Ensure the final commit message references the Jira ID.

-----

## Project Structure

The repository is organized as a Monorepo (likely using Turborepo, Nx, or Yarn Workspaces).

```text
/
├── apps/
│   ├── server/         # Fastify Backend (Node.js/TS)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │
│   ├── client/         # Web Frontend (React/TS)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── pages/
│   │
│   └── mobile/         # Native Android App (Kotlin)
│       ├── src/main/java/com/project/
│       │   ├── ui/
│       │   └── data/
│
├── packages/           # Shared code
│   ├── shared/         # Shared Types (DTOs), Constants, Utilities
│   │   ├── src/
│   │   └── package.json
│   └── eslint-config/  # Shared Linting configurations
│
├── package.json        # Root configuration
└── README.md
```

### Responsibilities

  * **apps/server**: Handles data persistence, game state, and API logic.
  * **apps/client**: User interface for web browsers.
  * **apps/mobile**: Native experience for Android users.
  * **packages/shared**: The "Source of Truth" for types used by both Server and Client to ensure type safety across the network.
