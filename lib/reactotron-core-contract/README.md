# reactotron-core-contract

TypeScript contracts for WebSocket messages between `reactotron-core-server` and `reactotron-core-client`.

This package provides the type definitions and command enums that ensure type-safe communication between Reactotron clients, plugins, and servers.

## Installation

```bash
npm install reactotron-core-contract
# or
yarn add reactotron-core-contract
```

## What's Included

### Command Types Enum

The `CommandType` object contains all available command type strings as constants:

```typescript
import { CommandType } from "reactotron-core-contract"

CommandType.Log // "log"
CommandType.ApiResponse // "api.response"
CommandType.Benchmark // "benchmark.report"
CommandType.Display // "display"
CommandType.Image // "image"
// ... and many more
```

### Payload Types

Each command has a corresponding payload type that defines its structure:

```typescript
import type {
  LogPayload,
  ApiResponsePayload,
  BenchmarkReportPayload,
  DisplayPayload,
  ImagePayload,
  StateActionCompletePayload,
  // ... and more
} from "reactotron-core-contract"
```

### Command Interface

The base `Command` interface that all messages follow:

```typescript
import type { Command, CommandTypeKey } from "reactotron-core-contract"

interface Command<Type extends CommandTypeKey, Payload> {
  type: CommandTypeKey
  connectionId: number
  clientId?: string
  date: Date
  deltaTime: number
  important: boolean
  messageId: number
  payload: Payload
  diff?: any
}
```

## Usage in Clients

Clients use the contract types to send properly typed commands to the server:

```typescript
import { CommandType } from "reactotron-core-contract"
import type { LogPayload, ApiResponsePayload, DisplayPayload } from "reactotron-core-contract"

// Sending a log command
const logPayload: LogPayload = {
  level: "debug",
  message: "Hello, Reactotron!",
}
client.send(CommandType.Log, logPayload)

// Sending an API response
const apiPayload: ApiResponsePayload = {
  request: {
    url: "https://api.example.com/users",
    method: "GET",
    data: null,
    headers: { Accept: "application/json" },
    params: {},
  },
  response: {
    body: '{"users": [...]}',
    status: 200,
    headers: { "Content-Type": "application/json" },
  },
  duration: 245,
}
client.send(CommandType.ApiResponse, apiPayload)

// Sending a custom display event
const displayPayload: DisplayPayload = {
  name: "User Login",
  value: { userId: 123, username: "steve" },
  preview: "Steve logged in successfully",
}
client.send(CommandType.Display, displayPayload, true) // marked important
```

## Usage in Plugins

Plugins import payload types to ensure they're sending properly structured data:

### Example: API Response Plugin

```typescript
import type { ApiResponsePayload } from "reactotron-core-contract"
import type { ReactotronCore, Plugin } from "reactotron-core-client"

const apiResponse = () => (reactotron: ReactotronCore) => {
  return {
    features: {
      apiResponse: (
        request: ApiResponsePayload["request"],
        response: ApiResponsePayload["response"],
        duration: number
      ) => {
        reactotron.send("api.response", { request, response, duration })
      },
    },
  } satisfies Plugin<ReactotronCore>
}
```

### Example: Benchmark Plugin

```typescript
import type { BenchmarkReportPayload } from "reactotron-core-contract"
import type { ReactotronCore, Plugin } from "reactotron-core-client"

const benchmark = () => (reactotron: ReactotronCore) => {
  const benchmark = (title: string) => {
    const steps: BenchmarkReportPayload["steps"] = []

    const step = (stepTitle: string) => {
      steps.push({
        title: stepTitle,
        time: performance.now(),
        delta: 0,
      })
    }

    const stop = () => {
      reactotron.send("benchmark.report", { title, steps })
    }

    return { step, stop }
  }

  return {
    features: { benchmark },
  } satisfies Plugin<ReactotronCore>
}
```

### Example: Handling Server Commands

Plugins can also handle commands from the server by checking the command type:

```typescript
import { CommandType } from "reactotron-core-contract"
import type { StateValuesRequestPayload } from "reactotron-core-contract"

const myPlugin = () => (reactotron) => {
  return {
    onCommand: (command) => {
      // Type-safe command handling
      if (command.type === CommandType.StateValuesRequest) {
        const payload = command.payload as StateValuesRequestPayload
        const { path } = payload
        // Handle the request...
      }
    },
  }
}
```

## Available Command Types & Payloads

### Client → Server Commands

| Command Type                          | Payload Type                     | Description                        |
| ------------------------------------- | -------------------------------- | ---------------------------------- |
| `CommandType.Log`                     | `LogPayload`                     | Log messages, warnings, and errors |
| `CommandType.ApiResponse`             | `ApiResponsePayload`             | HTTP request/response information  |
| `CommandType.Benchmark`               | `BenchmarkReportPayload`         | Performance benchmark results      |
| `CommandType.ClientIntro`             | `ClientIntroPayload`             | Client connection information      |
| `CommandType.Display`                 | `DisplayPayload`                 | Custom display events              |
| `CommandType.Image`                   | `ImagePayload`                   | Image data with metadata           |
| `CommandType.SagaTaskComplete`        | `SagaTaskCompletePayload`        | Redux-saga task completion data    |
| `CommandType.StateActionComplete`     | `StateActionCompletePayload`     | State action completion            |
| `CommandType.StateValuesChange`       | `StateValuesChangePayload`       | State value change notifications   |
| `CommandType.StateKeysResponse`       | `StateKeysResponsePayload`       | Response with state keys           |
| `CommandType.StateValuesResponse`     | `StateValuesResponsePayload`     | Response with state values         |
| `CommandType.StateBackupResponse`     | `StateBackupResponsePayload`     | State backup data                  |
| `CommandType.AsyncStorageMutation`    | `AsyncStorageMutationPayload`    | AsyncStorage changes               |
| `CommandType.CustomCommandRegister`   | `CustomCommandRegisterPayload`   | Register a custom command          |
| `CommandType.CustomCommandUnregister` | `CustomCommandUnregisterPayload` | Unregister a custom command        |
| `CommandType.ReplLsResponse`          | `ReplLsResponsePayload`          | REPL list response                 |
| `CommandType.ReplExecuteResponse`     | `ReplExecuteResponsePayload`     | REPL execution result              |

### Server → Client Commands

| Command Type                       | Payload Type                  | Description                  |
| ---------------------------------- | ----------------------------- | ---------------------------- |
| `CommandType.StateValuesRequest`   | `StateValuesRequestPayload`   | Request state values at path |
| `CommandType.StateKeysRequest`     | `StateKeysRequestPayload`     | Request state keys at path   |
| `CommandType.StateValuesSubscribe` | `StateValuesSubscribePayload` | Subscribe to state changes   |
| `CommandType.StateActionDispatch`  | `StateActionDispatchPayload`  | Dispatch an action           |
| `CommandType.StateBackupRequest`   | `StateBackupRequestPayload`   | Request state backup         |
| `CommandType.StateRestoreRequest`  | `StateRestoreRequestPayload`  | Restore state from backup    |
| `CommandType.Clear`                | `undefined`                   | Clear the timeline           |

### React Native Specific

| Command Type                 | Description                 |
| ---------------------------- | --------------------------- |
| `CommandType.DevtoolsOpen`   | Open React Native DevTools  |
| `CommandType.DevtoolsReload` | Reload the React Native app |
| `CommandType.EditorOpen`     | Open a file in the editor   |
| `CommandType.Storybook`      | Toggle Storybook            |
| `CommandType.Overlay`        | Toggle overlay              |

## For Plugin Authors

When creating a Reactotron plugin:

1. Import the relevant payload types from `reactotron-core-contract`
2. Use `CommandType` enum for command type strings
3. Type your plugin functions with the payload types
4. Return a plugin object that satisfies the `Plugin<ReactotronCore>` interface

Example plugin structure:

```typescript
import type { MyPayloadType } from "reactotron-core-contract"
import type { ReactotronCore, Plugin } from "reactotron-core-client"

export default (config = {}) =>
  (reactotron: ReactotronCore) => {
    return {
      // Handle server commands
      onCommand: (command) => {
        // Check command.type and handle accordingly
      },

      // Add features to Reactotron instance
      features: {
        myFeature: (data: MyPayloadType) => {
          reactotron.send("my.command", data)
        },
      },

      // Lifecycle hooks
      onConnect: () => {
        /* ... */
      },
      onDisconnect: () => {
        /* ... */
      },
    } satisfies Plugin<ReactotronCore>
  }
```

## Learn More

- [Reactotron Core Client](../reactotron-core-client/README.md) - How to use the client
- [Creating Plugins](../../docs/plugins/index.md) - Guide to creating plugins
- [Custom Commands](../../docs/custom-commands.md) - Working with custom commands
