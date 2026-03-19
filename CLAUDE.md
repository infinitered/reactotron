# Reactotron MCP Integration

## What this is

Adding MCP (Model Context Protocol) support to Reactotron so Claude Code can read debug events and send commands to connected React Native / React apps.

## Architecture

```
React Native app
    | WebSocket (unchanged, port 9090)
    v
Reactotron Desktop (Electron app)
    ├── relay server (reactotron-core-server, port 9090)
    └── MCP server (reactotron-mcp, HTTP on port 4567)
          ↑ Claude Code connects directly via HTTP MCP transport
          |
Claude Code
```

**Separation of concerns:**

- `lib/reactotron-core-server` — relay, connections, commands, event emitter. Unchanged except exposing internals needed by the MCP package.
- `lib/reactotron-mcp` — new package. MCP resource/tool definitions, `@modelcontextprotocol/sdk` HTTP transport. Receives the Server instance, reads connections/commands from it, sends commands through it. No CLI, no standalone process.
- `apps/reactotron-app` — imports `reactotron-mcp`, passes it the Server instance, wires the MCP toggle button in the footer. Minimal glue.

**Usage from `reactotron-mcp`:**
```ts
import { createMcpServer } from "reactotron-mcp"
const mcp = createMcpServer(reactotronServer)
mcp.start(4567)   // starts HTTP MCP endpoint
mcp.stop()
```

**Claude Code config:**
```json
{
  "mcpServers": {
    "reactotron": {
      "url": "http://localhost:4567/mcp"
    }
  }
}
```

No separate process. No stdio. No npx. Claude Code connects directly to the MCP HTTP endpoint served by the Reactotron desktop app.

## What's been done

### 1. MCP toggle in desktop app footer (working)

- `apps/reactotron-app/src/renderer/contexts/Standalone/index.tsx` — `mcpStatus`, `mcpPort`, `toggleMcp` in context
- `apps/reactotron-app/src/renderer/components/Footer/index.tsx` — passes MCP props
- `apps/reactotron-app/src/renderer/components/Footer/Stateless.tsx` — MCP button with green dot indicator

### 2. HTTP RPC API in reactotron-core-server (needs to be replaced)

Currently has a custom HTTP RPC API (`startHttpApi`/`stopHttpApi`) that was a prototype. This needs to be **removed** — the MCP server in `lib/reactotron-mcp` will serve MCP protocol directly over HTTP instead, reading from the Server instance in-process.

### 3. Previous reactotron-mcp standalone package (at `/Users/kim/dev/reactotron-mcp/`)

Built as a standalone MCP server that talked to the HTTP RPC API. Has useful code to reuse:
- Resource definitions (timeline, state, network, apps, benchmarks)
- Tool definitions (dispatch_action, request_state, swap_state, clear_timeline, send_custom_command)
- MCP SDK wiring (registry pattern)

This needs to be **rewritten as a library** at `lib/reactotron-mcp/` that receives the Server instance directly instead of making HTTP calls.

## What's left to do

1. Create `lib/reactotron-mcp/` package in the monorepo
   - Depends on `@modelcontextprotocol/sdk` and `reactotron-core-server`
   - Exports `createMcpServer(server: Server)` that returns `{ start(port), stop() }`
   - Resources read from `server.connections`, listen to `server.emitter` for commands
   - Tools call `server.send()` to push commands to connected apps
   - Uses MCP SDK HTTP/SSE transport (not stdio)

2. Remove the HTTP RPC API from `reactotron-core-server` (startHttpApi, stopHttpApi, handleHttpRpc, command buffer)

3. Update desktop app toggle to use the new `reactotron-mcp` package instead of `server.startHttpApi()`

4. Create feature branch, commit, test end-to-end

5. PR to infinitered/reactotron

## How to run locally

```bash
yarn install
yarn start        # launches Electron dev app
```

Click the "MCP" button in the footer bar to start the MCP server on port 4567.

## Key files

- `lib/reactotron-core-server/src/reactotron-core-server.ts` — relay server (remove HTTP RPC additions)
- `lib/reactotron-mcp/` — new package (MCP server library)
- `apps/reactotron-app/src/renderer/contexts/Standalone/index.tsx` — MCP state/toggle
- `apps/reactotron-app/src/renderer/components/Footer/Stateless.tsx` — MCP button UI

## Repository

- Origin: `kbrandwijk/reactotron` (fork)
- Upstream: `infinitered/reactotron`
