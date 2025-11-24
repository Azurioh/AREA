# Web Architecture (React)

The `apps/client` application follows a **Feature-First Architecture** (also known as Domain-Driven Structure). Instead of grouping files by their technical type (putting all components together, all hooks together), we group them by **business domain**.

## 1. High-Level Overview

```text
src/
├── assets/          # Static assets (fonts, images, global svgs)
├── components/      # Shared, atomic UI components (Buttons, Inputs...)
├── contexts/        # Global React Contexts (Auth, Theme)
├── features/        # ⚠️ The core of the app: Feature-based modules
├── hooks/           # Global hooks shared across multiple features
├── lib/             # Configuration, API Clients, and Utils
└── main.tsx         # Application entry point
```

## 2\. The `features/` Directory

This is where most of the development happens. Each feature is a self-contained module that handles a specific domain of the application (e.g., `auth`, `webhook`, `user-profile`).

### Anatomy of a Feature

If you are working on the **Webhooks** feature, you will work exclusively in `src/features/webhook/`.

```text
src/features/webhook/
├── api/             # API calls specific to webhooks (Client methods)
├── components/      # Components used ONLY within this feature
├── hooks/           # Logic/State specific to this feature
└── routes/          # Page components (Views) for this feature
```

| Folder | Description |
| :--- | :--- |
| **`api`** | Contains specific API endpoints. Example: `WebhookClient.ts`. |
| **`components`** | "Smart" components that know about the feature data. Example: `WebhookList.tsx`. |
| **`hooks`** | Custom hooks to manage feature logic. Example: `useWebhookList.ts`. |
| **`routes`** | The full page views exported to the router. Example: `WebhookPage.tsx`. |

### Why this approach?

  * **Co-location:** Everything related to a feature is in one place.
  * **Scalability:** Adding a new feature doesn't clutter the global `components` folder.
  * **Maintainability:** Deleting a feature is as simple as deleting its folder.

## 3\. The `components/` Directory

This directory is split into two parts:

### `components/ui/`
Reserved for **Generic UI Components** (Primitives).
We use **shadcn/ui** and **Tailwind CSS**.

  * **Rule:** Components here must be "dumb". They should not contain business logic, make API calls, or know about the specific data of the application.
  * **Example:** `Button`, `Input`, `Skeleton`.

### `components/` (Root)
Reserved for **Shared Application Components**.
These are components used across multiple features but are specific to the application's design or logic.

  * **Example:** `LoadingScreen.tsx` (used by multiple pages to show a loading state).

## 4\. Global State (`contexts/`)

We use React Context for global state that needs to be accessed by the entire application.

*   **`AuthContext`**: Manages user authentication state (login, logout, user data).
*   **`ThemeContext`**: Manages application theming (dark mode, accessibility fonts, color blindness modes).

## 5\. Data Fetching & State

We do not fetch data directly in components.

### API Client & Libs (`lib/`)

*   **`ApiClient.ts`**: Centralized Axios/Fetch instance with base URL, headers, and error handling.
*   **`TokenManager.ts`**: Handles storage and retrieval of authentication tokens (JWT).
*   **`utils.ts`**: General utility functions (e.g., class name merging with `cn`).

### How to fetch data in a Feature

1.  Define the fetch function in `features/xgz/api/XyzClient.ts`.
2.  Create a hook in `features/xyz/hooks/useXyz.ts` (using `useEffect`, React Query, or SWR).
3.  Consume the hook in your component.

## 6\. Where should I put my code?

Use this decision tree to decide where to create a new file:

**Q1: Is this code used by multiple, unrelated features?**

  * **Yes:**
      * Is it a shared app component? -\> `src/components`
      * Is it a helper function? -\> `src/lib` or `src/hooks`
  * **No (It's specific to one domain):**
      * Go to `src/features/<feature-name>/`
      * Is it a page? -\> `routes/`
      * Is it a sub-component? -\> `components/`
      * Is it logic? -\> `hooks/`

## 7\. Best Practices

  * **Absolute Imports:** Always use the `@/` alias.
      * ✅ `import { Button } from "@/components/ui/button"`
      * ❌ `import { Button } from "../../../components/ui/button"`
  * **Strict Types:** Define interfaces for your API responses, preferably in `packages/shared` if used by the backend, or locally in the feature if front-only.
  * **Clean Components:** Keep your JSX clean. If a component exceeds 150 lines, try to extract parts of it into smaller components within the same feature folder.
