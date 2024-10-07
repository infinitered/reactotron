# reactotron-react-native-mmkv

Log updates to your [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) store in the Reactotron timeline.

# Installing

```bash
npm i --save-dev reactotron-react-native-mmkv
# or
yarn add -D reactotron-react-native-mmkv
```

## Usage

Import your mmkv storage instance:

```tsx
import { MMKV } from "react-native-mmkv"
export const storage = new MMKV()
```

To use the `mmkvPlugin`, add the additional plugin on the `import` line.

```tsx
import Reactotron from "reactotron-react-native"
import type { ReactotronReactNative } from "reactotron-react-native"
import mmkvPlugin from "reactotron-react-native-mmkv"
import { storage } from "./mmkv/storage/instance/location" // <--- update this location
...
Reactotron.configure()
  .use(mmkvPlugin<ReactotronReactNative>({ storage })) // <--- here we go!
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
