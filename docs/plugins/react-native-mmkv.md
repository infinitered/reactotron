---
title: MMKV
---

# React Native MMKV

The `reactotron-react-native-mmkv` plugin allows you to track [MMKV](https://github.com/mrousavy/react-native-mmkv) updates.

## Installing

```
npm i --save-dev reactotron-react-native-mmkv
```

```
yarn add -D reactotron-react-native-mmkv
```

## Usage

Import your MMKV storage instance:

```tsx
import { MMKV } from "react-native-mmkv"
export const storage = new MMKV()
```

To use the `mmkvPlugin`, add the additional plugin on the `import` line.

```tsx
import Reactotron from "reactotron-react-native"
// success-line
import type { ReactotronReactNative } from "reactotron-react-native"
// success-line
import mmkvPlugin from "reactotron-react-native-mmkv"
// success-line
import { storage } from "./mmkv/storage/instance/location" // <--- update this to your mmkv instance.
...
Reactotron.configure()
  // success-line
  .use(mmkvPlugin<ReactotronReactNative>({ storage }))
  .connect()
```

And you're done! Now you can see your MMKV in Reactotron.

## Advanced Usage

`mmkvPlugin()` accepts an object with an `ignore` key. The value is an array of strings you would like to prevent sending to Reactotron.

```tsx
mmkvPlugin<ReactotronReactNative>({
  storage,
  ignore: ["secret"],
})
```
