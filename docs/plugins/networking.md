---
title: Networking
---

# Networking

The `networking` plugin is `reactotron-react-native` which allows you to track all XMLHttpRequests in React Native.

On Expo SDK 56+, `expo/fetch` is installed as the default `globalThis.fetch`. It is backed by a native module and bypasses `XMLHttpRequest`, so it would otherwise be invisible to this plugin. The plugin detects this case and tracks `expo/fetch` requests as well (see `ignoreExpoFetch` below to opt out). Requests made through React Native's regular XHR-backed `fetch` continue to be tracked via `XMLHttpRequest`, so there is no double-reporting.

## Usage

To use the `networking` plugin, you need to add the additional plugin on the `import` line.

```js
import Reactotron, { networking } from "reactotron-react-native";
```

Next, add it as a plugin to Reactotron.

```js
Reactotron.configure()
  .use(networking()) // <--- here we go!
  .connect();
```

And you're done! Now you can see your XMLHttpRequests in Reactotron.

## Advanced Usage

`networking()` also accepts an object with these options:

- `ignoreContentTypes`: a regular expression which, when matched against the `Content-Type` response header, will prevent the data from being displayed in Reactotron. You typically want to do this for images (which is the default). `text/event-stream` response bodies are always skipped so streaming responses are not buffered.
- `ignoreUrls`: a regular expression which, when matched against the URL of the request, will prevent the request from being tracked in Reactotron. Can be useful for ignoring noisy logging requests.
- `ignoreExpoFetch`: set to `true` to skip instrumenting Expo's `expo/fetch` (the default `globalThis.fetch` on Expo SDK 56+). Has no effect on non-Expo runtimes, where the global fetch is XHR-backed and already covered by XHR tracking.
- `fetch`: explicitly pass the fetch function to track; it is wrapped and installed as `globalThis.fetch` on connect, skipping the automatic `expo/fetch` detection. Takes precedence over `ignoreExpoFetch`.

```js
networking({
  ignoreContentTypes: /^(image)\/.*$/i,
  ignoreUrls: /\/(logs|symbolicate)$/,
});
```

### Tracking fetch in expo-router apps

Expo Router (the default `create-expo-app` template) re-wraps `globalThis.fetch` at startup with its `window.location` polyfill, which drops the marker the automatic `expo/fetch` detection looks for — so on expo-router apps fetch requests are silently not tracked. Automatic detection for expo-router apps is in the works (tracked in [#1612](https://github.com/infinitered/reactotron/issues/1612)); until then, use the `fetch` option to track them:

```js
Reactotron.configure()
  .useReactNative({
    networking: { fetch: globalThis.fetch },
  })
  .connect();
```

Two caveats:

- **Ordering**: capture `globalThis.fetch` in code that runs _after_ `expo-router/entry` has set up its wrapper (any module imported from your app code qualifies — the router entry runs first). Capturing it too early passes the pre-router fetch, and the router's wrapper will be bypassed or clobbered.
- **No XHR-backed fetch**: only pass a fetch that does _not_ go through `XMLHttpRequest` (e.g. don't use this with `EXPO_PUBLIC_USE_RN_FETCH=1`). XHR-backed fetch is already tracked by the XHR interceptor, so wrapping it here would double-report every request.

Also note: Expo SDK 56 releases before 56.0.19 have a `Response.clone()` bug ([expo#46397](https://github.com/expo/expo/pull/46397)) where cloning a response twice can throw a spurious "body already used" error. Reactotron reads response bodies off a clone while tracking is active, so if your app also clones responses, upgrade to expo 56.0.19+ (or SDK 57).
