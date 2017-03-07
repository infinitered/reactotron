# Overlay

Overlay is a plugin for `reactotron-react-native` which allows you to have an image uploaded
to your simulator to stay on top of your app.


# Usage

Wherever you setup your Reactotron in your app, you also add the additional plugin on the `import` line.

```js
import Reactotron, { overlay } from 'reactotron-react-native'
```

Add it as a plugin to Reactotron.

```js
Reactotron
  .configure()
  .use(overlay()) // <--- here we go!
  .connect()
```

Next, find the root UI component in your app and wrap it.

```js
// let's pretend this is your app.
class MyApp extends Component {
  render () {
    return <Text>I may have shipped too early.</Text>
  }
}

// let's wrap it, so the overlay stays on top!
const MyAppWithBenefits = console.tron.overlay(MyApp)

export default MyAppWithBenefits
```
