# Async Storage

Included in `reactotron-react-native` is a plugin called `networking` which allows you to track all XMLHttpRequests in React Native.

## Usage

Wherever you setup your Reactotron in your app, you also add the additional plugin on the `import` line.

```js
import Reactotron, { networking } from 'reactotron-react-native'
```

Next, add it as a plugin to Reactotron.

```js
Reactotron
  .configure()
  .use(networking()) // <--- here we go!
  .connect()
```

You're done.

## Advanced Usage

`networking()` also accepts an object with an `ignoreContentTypes` key.  The value is a regular expression which, when matched against the `Content-Type` response header, will prevent the data from being displayed in Reactotron.  You typically want to do this for images (which is the default).

```js
networking({
  ignoreContentTypes: /^(image)\/.*$/i
})
```
