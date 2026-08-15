---
title: AsyncStorage
---

# AsyncStorage

The `asyncStorage` plugin is part of `reactotron-react-native` which allows you to track [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage.html) on React Native.

## Usage

To use the Async Storage plugin, add the additional plugin on the `import` line.

```js
import Reactotron, { asyncStorage } from "reactotron-react-native"
```

Next, add it as a plugin to Reactotron.

```js
Reactotron.configure()
  .use(asyncStorage()) // <--- here we go!
  .connect()
```

And you're done! Now you can see your AsyncStorage in Reactotron.

## Advanced Usage

`asyncStorage()` also accepts an object with an `ignore` key to filter against. The value of `ignore` is an array of string or RegExp patterns that match against AsyncStorage keys you want to prevent from being sent to Reactotron.

> String patterns match any key containing that text, while RegExp patterns use standard regex matching.

```js
asyncStorage({
  ignore: ["secret", /^debug_/, "temp"],
})
```
