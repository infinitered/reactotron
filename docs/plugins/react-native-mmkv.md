---
title: MMKV
---

# React Native MMKV

The `react-native-mmkv` plugin allows you to track [MMKV](https://github.com/mrousavy/react-native-mmkv) updates.

## Usage

Import your mmkv storage instance:

```js
import { MMKV } from "react-native-mmkv";
export const storage = new MMKV();
```

To use the `mmkvPlugin`, add the additional plugin on the `import` line.

```js
import Reactotron from "reactotron-react-native"
import mmkvPlugin from "reactotron-react-native-mmkv"
import { storage } from "./mmkv/storage/instance/location" // <--- update this location
...
Reactotron.configure()
  .use(mmkvPlugin({ storage })) // <--- here we go!
  .connect()
```

And you're done! Now you can see your MMKV in Reactotron.

## Advanced Usage

`mmkvPlugin()` accepts an object with an `ignore` key. The value is an array of strings you would like to prevent sending to Reactotron.

```js
mmkvPlugin({
  storage,
  ignore: ["secret"],
});
```
