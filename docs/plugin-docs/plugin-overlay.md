# Overlay

Overlay is a plugin for `reactotron-react-native` which allows you to have an image uploaded
to your simulator to stay on top of your app. This helps you to create those pixel perfect screens by helping ypu compare your app to the design.

## Configuration

To use the Overlay plugin, add the additional plugin on the `import` line.

```js
import Reactotron, { overlay } from "reactotron-react-native"
```

Add it as a plugin to Reactotron.

```js
Reactotron.configure()
  .use(overlay()) // <--- here we go!
  .connect()
```

## Usage

Next, find the root UI component in your app and wrap it.

```js
// let's pretend this is your app.
class MyApp extends Component {
  render() {
    return <Text>I may have shipped too early.</Text>
  }
}

// let's wrap it, so the overlay stays on top!
const MyAppWithBenefits = Reactotron.overlay(MyApp)

export default MyAppWithBenefits
```

# React Native Production Caveat

One common gotcha here is when you make production builds since `reactotron-react-native` is likely setup in `devDependencies`.

If you'd like to keep it like this (I recommend it!), then perhaps your code might look more like this:

```js
const MyAppWithBenefits = __DEV__ ? Reactotron.overlay(MyApp) : MyApp
```

Another option is to ship it in your `dependencies` (not recommended -- but sometimes you wanna run it on a device).
