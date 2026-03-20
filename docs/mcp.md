---
sidebar_position: 6
title: MCP Server (Claude Code)
---

Reactotron includes a built-in [MCP](https://modelcontextprotocol.io/) server that lets AI coding assistants like [Claude Code](https://claude.ai/claude-code) read your app's debug events and send commands — all within a coding conversation.

## Getting started

1. Open Reactotron and connect your app as usual.
2. Click the **MCP** button in the footer bar. A green dot indicates the server is running.
3. In your terminal, add the MCP server to Claude Code:

```bash
claude mcp add --transport http reactotron http://localhost:4567/mcp
```

That's it. Claude Code can now read your app's timeline, inspect state, dispatch actions, and more.

## What can Claude Code do?

### Read debug data

Claude Code can read these resources on demand:

- **Timeline** — the last 500 debug events (logs, state changes, network requests, benchmarks, custom commands)
- **App State** — the latest cached Redux/MST state snapshot
- **Network Log** — all captured HTTP requests and responses
- **Connected Apps** — which apps are connected, with their platform and version
- **Benchmarks** — performance benchmark results
- **State Subscriptions** — values at subscribed state paths whenever they change
- **AsyncStorage** — all AsyncStorage mutations (setItem, removeItem, etc.)

### Send commands

Claude Code can also interact with your running app:

- **Dispatch Redux actions** — e.g. "dispatch a RESET action"
- **Request a fresh state snapshot** — asks the app for current state
- **Replace app state** — hot-swap the entire state tree
- **Send custom commands** — trigger any custom command registered in your app
- **Show image overlay** — overlay a design mockup on the running app (supports local files)
- **Subscribe to state paths** — watch specific parts of state for changes
- **Clear the event buffer** — reset what Claude sees to focus on new interactions

### Multi-app support

If multiple apps are connected to Reactotron, Claude Code will ask which app you're working on. It can auto-detect the right app when only one is connected.

## Configuration

The MCP port defaults to **4567** and can be changed in Reactotron's settings (stored via electron-store as `mcpPort`).

The server only binds to `127.0.0.1` (localhost) and is not accessible from other machines on your network.

## Image overlay

The `show_overlay` tool lets Claude Code overlay an image on your running app — useful for comparing a design mockup against the actual UI.

```text
"Show the design mockup from ~/Downloads/design.png as an overlay on the app"
```

- Accepts local file paths, `file://` URIs, `http://` URLs, or `data:` URIs
- Local files are automatically converted to base64
- Image dimensions are extracted from PNG/JPEG/GIF headers
- Supported formats: **PNG, JPEG, GIF**

## Example conversation

> **You:** "Look at the Reactotron timeline and tell me what's happening"
>
> **Claude:** _reads the timeline resource_ "I can see 3 API calls failing with 401 errors. Your auth token might be expired. Want me to check the current state?"
>
> **You:** "Yes, check the auth state"
>
> **Claude:** _calls request_state_ "The auth token in state is empty. It looks like the login flow isn't saving the token. Let me look at the Redux actions..."

## Architecture

The MCP server runs inside the Reactotron desktop app as a separate package (`reactotron-mcp`). It reads directly from the relay server's connections and event stream — no proxy, no separate process, and no changes to your React Native app.

```text
React Native app
    | WebSocket (port 9090, unchanged)
    v
Reactotron Desktop
    ├── relay server (reactotron-core-server)
    └── MCP server (reactotron-mcp, HTTP on configurable port)
          ↑
Claude Code
```
