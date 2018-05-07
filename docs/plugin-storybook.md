# Storybook (React Native Only)

`reactotron-react-native` ships with a plugin called `storybook`.

This plugin, when configured properly, allows the switching to Storybook from the reactotron interface


# Usage

The storybook plugin gets turned on automatically when you use `.useReactNative()`. If you don't want to use that method you can manually wire up the plugin:

Wherever you setup your Reactotron in your app, you also add the additional plugin on the `import` line.

```js
import Reactotron, { storybook } from 'reactotron-react-native'
```

Next, add it as a plugin to Reactotron.

```js
Reactotron
  .configure()
  .use(storybook()) // <--- here we go!
  .connect()
```

Once the plugin is configured you have to wrap your entire app in a HOC provided by Reactotron. In addition to that Storybook requires some configuration. Here is an example:

```js
import { getStorybookUI, configure } from '@storybook/react-native'

{...}

configure(() => {
  require('../../storybook/stories') // This should point to your "root" set of stories
}, module)

const StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true }) // This configuration can be changed based upon personal wants

class StorybookUIHMRRoot extends Component {
  render () {
    return <StorybookUIRoot />
  }
}

// Assuming you have Reactotron on console.tron
export default console.tron.storybookSwitcher(StorybookUIHMRRoot)(RootContainer)
```
