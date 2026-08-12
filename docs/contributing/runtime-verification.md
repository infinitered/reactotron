---
name: Verifying Fixes at Runtime
sidebar_position: 98
---

# Verifying Fixes at Runtime

Unit tests catch regressions in the mechanism, but many Reactotron bugs live in the seams between the client library, the app's runtime environment, and the desktop app. This guide documents an end-to-end flow for verifying a fix against a **real app on a real simulator talking to a real Reactotron desktop build**. Beyond bug verification, this is a general recipe for testing full end-to-end interactions between a real development build of the desktop app and an app running on a simulator — both sides scriptable, so the whole loop (app fires an event → client reports it → desktop renders it) can be exercised and asserted without manual clicking.

The core idea: run the Reactotron desktop app from the PR branch with a Chrome DevTools Protocol (CDP) port open so you can read its timeline programmatically, run a test app with the PR's client library installed from packed tarballs, and compare **baseline** (published packages, bug reproduced) against **fix** (PR tarballs, bug gone).

## 1. Set up a worktree for the PR

```bash
git fetch origin pull/<PR_NUMBER>/head:pr-<PR_NUMBER>
git worktree add ../reactotron-pr-<PR_NUMBER> pr-<PR_NUMBER>
cd ../reactotron-pr-<PR_NUMBER>
yarn install && yarn build
yarn workspace <changed-package> test
```

This keeps your main checkout clean and lets you build everything from the PR's exact commits. (For fork PRs, CI needs the [trust process](./ci.md) separately — local verification doesn't.)

## 2. Pack the client libraries as tarballs

Test apps should consume the PR's packages the way users do — from installable tarballs, not workspace symlinks. Pack the changed package **and its workspace dependencies** (`yarn pack` rewrites `workspace:*` to concrete versions, which may not exist on npm yet):

```bash
mkdir -p /tmp/tarballs
yarn workspace reactotron-core-contract pack --out /tmp/tarballs/reactotron-core-contract.tgz
yarn workspace reactotron-core-client pack --out /tmp/tarballs/reactotron-core-client.tgz
yarn workspace reactotron-react-native pack --out /tmp/tarballs/reactotron-react-native.tgz
```

## 3. Run the desktop app with a CDP port

The dev server (`yarn start`) is fine for manual testing, but for scripted verification run the built app directly with remote debugging enabled. One gotcha: `electron-webpack` writes the renderer to `dist/renderer/`, while `dist/main/main.js` loads `index.html` from its own directory — copy the renderer assets next to it first:

```bash
cd apps/reactotron-app
cp -R dist/renderer/ dist/main/
../../node_modules/.bin/electron dist/main/main.js --remote-debugging-port=9315
```

Now the timeline can be read (and clicked) from short Node scripts over raw CDP — no extra dependencies beyond Node 22+ (built-in `WebSocket` and `fetch`):

```js
// cdp.js — usage: node cdp.js '<js expression>'  (evaluates in the renderer)
const expr = process.argv[2] || "document.title"
const targets = await (await fetch("http://localhost:9315/json")).json()
const page = targets.find((t) => t.type === "page")
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((res, rej) => ((ws.onopen = res), (ws.onerror = rej)))
const result = await new Promise((res) => {
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data)
    if (d.id === 1) res(d.result)
  }
  ws.send(
    JSON.stringify({
      id: 1,
      method: "Runtime.evaluate",
      params: { expression: expr, returnByValue: true, awaitPromise: true },
    })
  )
})
console.log(JSON.stringify(result, null, 2))
ws.close()
```

The workhorse invocation is simply:

```bash
node cdp.js 'document.body.innerText'   # dump the visible timeline
```

which shows connections ("port 9090 | 1 connections") and timeline entries ("API RESPONSE (200) …"). You can also dispatch `.click()` on timeline rows through `Runtime.evaluate` to expand entries and read request/response details. (Note: Playwright's `connectOverCDP` does not work against the Electron version currently used — raw CDP does.)

## 4. Build a test app that reproduces the bug's environment

**Match the environment the bug report describes, not just any app.** The repo's `apps/example-app` is handy for generic checks, but it may not reproduce environment-specific bugs (its Expo SDK version can lag well behind current). Scaffolding a fresh `create-expo-app` gets you the current SDK *and* the default template's runtime setup (e.g. expo-router), which can behave differently from the environment a fix was developed against — that difference is often where the bugs are.

Give the test app:

- Buttons for each code path under test, with `testID`s (e.g. one firing `fetch`, one firing raw `XMLHttpRequest` as a **control** that should always be tracked)
- On-screen text for any environment preconditions the fix depends on (e.g. whether `globalThis.fetch` carries `Symbol.for("expo.builtin")`) — bugs in the *precondition* are exactly what runtime testing exists to find
- A standard `ReactotronConfig.ts` with the plugin under test enabled, imported at the top of the entry file

## 5. Baseline first, then the fix

1. **Baseline:** install the currently *published* client (`npm install reactotron-react-native@latest`), run the app on the simulator, exercise both buttons, and confirm the bug in the timeline via `cdp.js` (e.g. the control request appears, the affected one is missing). If you can't reproduce the bug, stop — you're not testing the right environment.
2. **Fix:** install the PR tarballs (all of them, so workspace deps resolve to the PR versions, not npm), restart Metro with `--clear`, relaunch the app, exercise the same buttons.
3. **Assert precisely:** the previously-missing entry now appears with correct method/URL/params/status/body *and* the control still appears exactly once (guards against double-reporting). Also confirm the app itself still works — e.g. the response body still reaches the caller.
4. Screenshot the simulator and capture the timeline text for the PR review, for both phases.

A JS-only client change doesn't need a native rebuild — keep the same installed app binary and just restart Metro.

## 6. Drive the simulator

Anything works — manual taps included. For scripted runs:

```bash
xcrun simctl launch --terminate-running-process booted <bundle.id>
xcrun simctl io booted screenshot phase-a.png
```

plus an accessibility-based driver (e.g. idb, or an iOS-simulator MCP server) to tap by `testID`. On Android, `yarn adb` in the example app reverses the ports Reactotron needs.

## Why bother: what this catches that tests don't

A fix's unit tests can all pass while the fix silently does nothing in the very scenario its issue describes — for example, when a runtime environment wraps or replaces a global that the fix keys its detection on. That class of bug — correct mechanism, wrong environment assumption — is only visible with the full stack running.
