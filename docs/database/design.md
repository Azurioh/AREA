# Database Schema (MongoDB)

## Collections

### users
Stores application users.

| Field                | Type                | Description                        |
|----------------------|---------------------|------------------------------------|
| _id                  | ObjectId            | Primary key                        |
| email                | String              | Unique user email                  |
| password             | String              | The user hashed password           |
| name                 | String              | The user's full name               |
| actions_reactions    | Array[ObjectId]     | The user's actions and reactions    |

---

### actions_reactions
Stores application actions / reactions.

| Field                | Type       | Description                             |
|----------------------|------------|-----------------------------------------|
| _id                  | ObjectId   | Primary key                             |
| action               | Object     | The informations regarding the action   |
| reaction             | Object     | The informations regarding the reaction |

#### action (Object)

| Field                | Type       | Description                             |
|----------------------|------------|-----------------------------------------|
| service              | String     | The service name                        |
| name                 | String     | The action name                         |
| parameters           | Object     | The parameters for the action           |
The action parameters object can contain various fields depending on the action type.

#### reaction (Object)

| Field                | Type       | Description                             |
|----------------------|------------|-----------------------------------------|
| service              | String     | The service name                        |
| name                 | String     | The action name                         |
| callback_url         | String     | The callback URL for the reaction       |
| parameters           | Object     | The parameters for the reaction         |

The reaction parameters object can contain various fields depending on the reaction type.

---

### external_account (this collection should be a template for other services accounts storage)
Stores application external accounts.

| Field                | Type                | Description                                |
|----------------------|---------------------|--------------------------------------------|
| _id                  | ObjectId            | Primary key                                |
| access_token         | String              | The access token for the external account  |
| refresh_token        | String              | The refresh token for the external account |
| account_id           | String              | The user's full name                       |
