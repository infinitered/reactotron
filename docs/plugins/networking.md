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

```js
networking({
  ignoreContentTypes: /^(image)\/.*$/i,
  ignoreUrls: /\/(logs|symbolicate)$/,
});
```
