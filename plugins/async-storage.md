<!-- UPDATE  -->
# Async Storage

Included in `reactotron-react-native` is a plugin called `asyncStorage` which allows you to track [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage.html) on React Native.

## Usage

Wherever you setup your Reactotron in your app, you also add the additional plugin on the `import` line.

```js
import Reactotron, { asyncStorage } from 'reactotron-react-native'
```

Next, add it as a plugin to Reactotron.

```js
Reactotron
  .configure()
  .use(asyncStorage()) // <--- here we go!
  .connect()
```

You're done.

## Advanced Usage

`asyncStorage()` also accepts an object with an `ignore` key.  The value is an array of strings you would like to prevent sending to Reactotron.

```js
asyncStorage({
  ignore: ['secret']
})
```
