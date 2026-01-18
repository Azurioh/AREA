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

## Adding A New Service

### Service Authorization

1. Add your service to the `ServiceType` type located at `app/backend/src/types/third-parties.ts`. If your service does not need OAuth, add it to the `NonOAuthServiceType` type.

```typescript
export type NoOAuthServiceType = 'your_no_oauth_service'';
export type ServiceType = 'your_oauth_service' | NoOAuthServiceType;
```

2. Then go in the third parties service located at `apps/backend/src/modules/third-parties/third-parties.service.ts`.

Add your service and the authorization URL, that will be used to redirect the user to the service's authorization page, to the `authorizationUrls` map:

```typescript
this.authorizationUrls = new Map([
  [
    'your_oauth_service',
    'https://your-service.com/oauth/authorize?redirect_uri={redirectUri}&state={state}'
  ]
]);
```

The `redirect_uri` and `state` parameters will be replaced automatically when generating the URL, so they must appear as shown in the example above.

If your service does not use OAuth, you can replace the authorization URL by `no_oauth`.

```typescript
this.authorizationUrls = new Map([
  [
    'your_no_oauth_service',
    'no_oauth'
  ]
]);
```
3. Finally in the same file, implement the logic to handle the service's authorization in a new private method named `authorizeTo<YourServiceName>`. This method parameters should be the following and it should return a `Promise<ThirdPartyAccount | null>`:

```typescript
export class ThirdPartiesService {
  private async authorizeToYourServiceName(
    userId: string, code: string
  ): Promise<ThirdPartyAccount | null> {
    // Your implementation here
  }
}
```

This function must return a `ThirdPartyAccount` on success, this account will be automatically added to the `third_parties_account` collection. If the authorization fails, return `null`.

If your service third party account need additional information from the user, you can create a custome type:

```typescript
export type TwitchAccount = BaseAccount & {
  service: 'your_service_name';
};
```

In this type you can add any additional property you need, as long as your authorization method fills them

IMPORTANT: When storing access and refresh tokens in the db, make sure to encrypt them using the provided `encryptString` utility function to ensure security.

### Implementing Your Service Actions

1. Create a new module in the `apps/backend/src/modules/` directory named after your service (e.g., `your-service-name`).

2. Inside this new module, create a service file (e.g., `your-service-name.service.ts`) where you will implement your actions logic.

3. In your service file, create a class named `YourServiceNameService` and implement the methods needed to interact with your service's API.

Your class should store a `ThirdPartiesService` instance to retrieve the third party accounts and their tokens and if your service actions requires polling, a `PollingService` instance to add user to poll.

```typescript
import { ThirdPartiesService } from '../third-parties/third-parties.service';
import { PollingService } from '../polling/polling.service';

export class YourServiceNameService {
  private thirdPartiesService: ThirdPartiesService;
  private pollingService: PollingService; // Only if polling is needed

  constructor(
    thirdPartiesService: ThirdPartiesService,
    pollingService: PollingService // Only if polling is needed
  ) {
    this.thirdPartiesService = thirdPartiesService;
    this.pollingService = pollingService; // Only if polling is needed
  }
}
```

4. Implement the method needed to create your actions. Your method should be named `createAction`. This method parameters should be the following and it should return a `Promise<string>`:

```typescript
export class YourServiceNameService {
  /**
   * @function createAction
   * @description Create an action for the service
   *
   * @param {string} actionReactionId - The id of the action reaction document
   * @param {string} userId - The id of the user creating the action
   * @param {CreateAction} action - The information about the action
   * @returns {Promise<string>} The trigger of the created action
   */
  async createAction(
    actionReactionId: string, userId: string, action: CreateAction
  ): Promise<string> {
    // Your implementation here
    return 'a_trigger_for_your_action_reaction';
  }
}
```

This method must return a string that will be used as a trigger to identify when the reaction associated to your action should be executed.

5. Once your method has been implemented, you need to register it in the `ActionReactionService` located at `apps/backend/src/modules/action-reaction/action-reaction.service.ts`.

In the constructor of the `ActionReactionService`, add your service to the parameters to then correctly add your `createAction` method to the `actionsCreationFunc` map:

```typescript
export class ActionsReactionsService {
  constructor(
    yourServiceNameService: YourServiceNameService
    // Other services...
  ) {
    this.actionsCreationFunc = new Map([
      [
        'your_service_name',
        this.yourServiceNameService.createAction.bind(this.yourServiceNameService)
      ]
    ]);
  }
}
```

Don't forget to bind your service instance to the method to keep the correct context.

### Implementing Your Service Actions In The Integrations

1. In the integrations module located at `apps/backend/src/modules/integrations/`, create a new directory named after your service (e.g., `your-service-name`).

2. Inside this new directory, create a new directory named `actions`. Inside this directory, create a new file for each action you implemented in your service (e.g., `your-action-name.action.ts`). and create a `index.ts` file to export all your actions.

3. In each action file, implement the action logic by creating a class that implements the `Action` interface located at `apps/backend/src/modules/integrations/_definitions/action.interface.ts`. Here is an example of how your action class should look like:

```typescript
import { Action } from '@/integrations/_definitions/action.interface';

export class YourServiceNameYourActionNameAction extends Action {
  constructor() {
    super(
      'your_action_name',
      'description_of_your_action',
      [
        {
          type: 'input',
          key: 'key_for_your_input_param',
          label: 'label_for_your_input_param',
          placeholder: 'placeholder_for_your_input_param',
        },
        {
          type: 'select',
          key: 'key_for_your_select_param',
          label: 'label_for_your_select_param',
          placeholder: 'placeholder_for_your_select_param',
          options: [],
        },
      ],
      [
        {
          key: 'your_action_variable',
          description: 'short_description_of_your_variable',
          type: 'type_of_your_variable',
          path: 'path.to.your.variable',
        },
      ],
    );
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the action
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
```

### Implementing Your Service Reactions

1. If you have done the steps to implement your service actions, you already have a module and a service file created for your service. If not, follow steps 1 to 3 of the "Implementing Your Service Actions" section and come back here.

2. Implement the method needed to create your actions. Your method should be named `createReaction`. This method parameters should be the following and it should return a `Promise<boolean>`:

```typescript
export class YourServiceNameService {
  /**
   * @function createReaction
   * @description Create a reaction for the service
   *
   * @param {string} userId - The id of the user creating the reaction
   * @param {CreateReaction} reaction - The information about the reaction
   * @param {ActionPayload} action - The information about the issued action
   * @returns {Promise<boolean>} If the reaction was created
   */
  async createReaction(
    userId: string, reaction: CreateReaction, action: ActionPayload
  ): Promise<boolean> {
    // Your implementation here
    return false; // or true if the reaction was successfully created
  }
}
```

This method must return a string that will be used as a trigger to identify when the reaction associated to your action should be executed.

3. Once your method has been implemented, you need to register it in the `ActionReactionService` located at `apps/backend/src/modules/action-reaction/action-reaction.service.ts`.

In the constructor of the `ActionReactionService`, add your service to the parameters to then correctly add your `createReaction` method to the `reactionsCreationFunc` map:

```typescript
export class ActionsReactionsService {
  constructor(
    yourServiceNameService: YourServiceNameService
    // Other services...
  ) {
    this.reactionsCreationFunc = new Map([
      [
        'your_service_name',
        this.yourServiceNameService.createReaction.bind(this.yourServiceNameService)
      ]
    ]);
  }
}
```

Don't forget to bind your service instance to the method to keep the correct context.


### Implementing Your Service Reactions In The Integrations

1. If you have implement an action for your service in the inrgrations part you already have your folder create, if not follow the step from the "Implementing Your Service Actions In The Integrations" section.

2. Inside this new directory, create a new directory named `reactions`. Inside this directory, create a new file for each action you implemented in your service (e.g., `your-reaction-name.reaction.ts`). and create a `index.ts` file to export all your reactions.

3. In each reaction file, implement the action logic by creating a class that implements the `Reaction` interface located at `apps/backend/src/modules/integrations/_definitions/reaction.interface.ts`. Here is an example of how your action class should look like:

```typescript
import { Reaction } from '@/integrations/_definitions/reaction.interface';

export class YourServiceNameYourReactionNameReaction extends Reaction {
  constructor() {
    super('your_reaction_name', 'description_of_your_reaction', [
      {
        type: 'input',
        key: 'key_for_your_input_param',
        label: 'label_for_your_input_param',
        placeholder: 'placeholder_for_your_input_param',
      },
      {
        type: 'select',
        key: 'key_for_your_select_param',
        label: 'label_for_your_select_param',
        placeholder: 'placeholder_for_your_select_param',
        options: [],
      },
    ]);
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the reaction
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
```

### Implementing Your Service Action Reception (if needed)

Some service require there action to pass through a kind of middleware before being treated by the `handleReactions` method.

1. In your service module, create a new method in your service file named `actionReception`. This method parameters should be the following and it should return a `Promise<ActionPayload[]>`:

```typescript
export class YourServiceNameService {
  /**
   * @function actionReception
   * @description The action reception for the service
   *
   * @param {ActionPayload} action - The payload of the action
   * @returns {Promise<ActionPayload[]>} A list of action payloads to handle
   */
  async actionReception(
    action: ActionPayload
  ): Promise<ActionPayload[]> {
    // Your implementation here
    return [];
  }
}
```

The array returned by this method will be passed to the `handleReactions` method to execute the reactions associated to the action stored in the `ActionPayload`.

2. Once your method has been implemented, you need to register it in the `ActionReactionService` located at `apps/backend/src/modules/action-reaction/action-reaction.service.ts`.

In the constructor of the `ActionReactionService`, add your service to the parameters to then correctly add your `actionReception` method to the `actionReceptionFunc` map:

```typescript
export class ActionsReactionsService {
  constructor(
    yourServiceNameService: YourServiceNameService
    // Other services...
  ) {
    this.actionReceptionFunc = new Map([
      [
        'your_service_name',
        this.yourServiceNameService.actionReception.bind(this.yourServiceNameService)
      ]
    ]);
  }
}
```

Don't forget to bind your service instance to the method to keep the correct context.

### Implementing Your Service Action Deletion (if needed)

Some services require cleaning up resources when an action is deleted.

1. In your service module, create a new method in your service file named `deleteAction`. This method parameters should be the following and it should return a `Promise<void>`:

```typescript
export class YourServiceNameService {
  /**
   * @function deleteAction
   * @description Delete an action reaction
   *
   * @param {WithId<ActionReaction>} actionReaction - The action reaction to delete
   * @returns {Promise<void>} Nothing
   */
  async deleteAction(
    actionReaction: WithId<ActionReaction>
  ): Promise<void> {
    // Your implementation here
  }
}
```

2. Once your method has been implemented, you need to register it in the `ActionReactionService` located at `apps/backend/src/modules/action-reaction/action-reaction.service.ts`.

In the constructor of the `ActionReactionService`, add your service to the parameters to then correctly add your `deleteAction` method to the `deleteActionFunc` map:

```typescript
export class ActionsReactionsService {
  constructor(
    yourServiceNameService: YourServiceNameService
    // Other services...
  ) {
    this.deleteActionFunc = new Map([
      [
        'your_service_name',
        this.yourServiceNameService.deleteAction.bind(this.yourServiceNameService)
      ]
    ]);
  }
}
```

Don't forget to bind your service instance to the method to keep the correct context.

### Implementing Webhooks Reception

Action will need to call those webhooks route to notify our application when an event occur.

1. In the webhook module located at `apps/backend/src/modules/webhook/`, create a new route that will receive your service webhook. This route should point to a new method in the webhook controller located at `apps/backend/src/modules/webhook/webhook.controller.ts`.

```typescript
export default async (app: FastifyInstance) => {
  app.route({
    method: 'POST',
    url: '/v1/your-service-name/',
    handler: controller.yourServiceNameCallback.bind(controller),
    schema: {
      summary: 'The callback of the your service name webhook',
      description: 'Handle the callback of the your service name webhook.',
      tags: ['Webhooks'],
    },
  });
}
```

2. In the webhook controller located at `apps/backend/src/modules/webhook/webhook.controller.ts`, implement the method that will handle the webhook reception. This method should extract the necessary information from the request, validate it, and then call the appropriate service methods to process the webhook data.

```typescript

export class WebhookController {
  /**
   * @function yourServiceNameCallback
   * @description The callback of the your service name webhook
   *
   * @param {FastifyRequest} request - The Fastify request
   * @param {FastifyReply} reply - The Fastify reply
   * @returns {Promise<void>} Nothing
   */
  async yourServiceNameCallback(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    // Your implementation here
    const body = request.body;

    this.service.yourServiceNameCallback(body as YourServiceNameWebhookPayload);
    reply.status(HttpStatusCode.NO_CONTENT).send();
  }
}
```

The method located in the service can take any parameters you need to process the webhook data, just make sure to send the body in which the action informations are stored.

3. In the webhook service located at `apps/backend/src/modules/webhook/webhook.service.ts`, implement the method that will handle the webhook data processing.

```typescript
export class WebhookService {
  /**
   * @function yourServiceNameCallback
   * @description Handle the your service name callback.
   *
   * @param {YourServiceNameWebhookPayload} body The body of the callback.
   * @returns {Promise<void>}
   */
  async yourServiceNameCallback(body: YourServiceNameWebhookPayload): Promise<void> {
    const action: ActionPayload = {
      service: 'your_service_name',
      name: 'your_action_name',
      trigger: 'your_action_trigger',
      content: {
        ...body
      },
    };

    this.actionsReactionsService.handleActionReception(action);
  }
}
```

This method will be in charge of creating the `ActionPayload` that will be sent to the `handleActionReception` method of the `ActionsReactionsService`. The `handleActionReception` method must be called in order to correctly process the action.

### Implement Polling (if needed)

If your service require polling to check for new events, you will need to implement a polling service for your service.

1. In the polling module located at `apps/backend/src/modules/polling/`, create a new file named `your-service-name.polling.ts`. In this file, implement a class named `YourServiceNamePollingService`, the class constructor should take the `PollingRepository` as parameter and any additional parameters you need.

```typescript
export class YourServiceNamePollingService {
  private readonly repository: PollingRepository;

  constructor(repository: PollingRepository) {
    this.repository = repository;
  }
}
```

2. Then, implement your polling method, the name of your method should start with `poll` followed by what your want to poll (e.g., `pollCurrentlyPlayingTrack` for spotify). The method should not take any parameters and should return a `Promise<void>`.

When your polling method triggers an event, it must create a `YourServiceNameWebhookPayload` and fetch the webhook route you have implemented in the "Implementing Webhooks Reception" section to notify our application of the event.

3. Finally, you need to register your polling service in the `setupPolling` function located at `apps/backend/src/config/setup-polling.ts`.

```typescript
const yourServiceNameIntervalId = setInterval(async () => {
  try {
    await yourServiceNamePolling.pollYourPollingMethod();
  } catch (error) {
    console.error('Error polling YourServiceName:', error);
  }
}, yourPollingIntervalInMilliseconds);

app.addHook('onClose', (_instance, done) => {
  clearInterval(yourServiceNameIntervalId);
  done();
});
```

### Register Your Service Integration

1. In the `index.ts` file located at `apps/backend/src/modules/integrations/your-service-name`, create a function that will create your service instance:

```typescript
import type { Service } from '@/integrations/_definitions/service.interface';
import * as actions from './actions';
import * as reactions from './reactions';

export const createYourServiceNameService = (): Service => {
  return {
    name: 'your_service_name',
    actions: Object.values(actions).map((Action) => new Action()),
    reactions: Object.values(reactions).map((Reaction) => new Reaction()),
  };
};
```

2. In the `register-service.ts` file located at `apps/backend/src/config/register-service.ts`, use the `ServiceManager` the following way to register your service:

```typescript
ServiceManager.instance.register(createYourServiceNameService());
```
