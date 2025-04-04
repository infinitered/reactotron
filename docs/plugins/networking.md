---
title: Networking
---

# Networking

The `networking` plugin is `reactotron-react-native` which allows you to track all XMLHttpRequests in React Native.

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

`networking()` also accepts an object with two options:

- `ignoreContentTypes`: a regular expression which, when matched against the `Content-Type` response header, will prevent the data from being displayed in Reactotron. You typically want to do this for images (which is the default).
- `ignoreUrls`: a regular expression which, when matched against the URL of the XHR, will prevent the request from being tracked in Reactotron. Can be useful for ignoring noisy logging requests.

```js
networking({
  ignoreContentTypes: /^(image)\/.*$/i,
  ignoreUrls: /\/(logs|symbolicate)$/,
});
```
