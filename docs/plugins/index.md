# Reactotron Plugins

Reactotron has a powerful plugin system with ready-made plugins for you to use in your app. You can also create your own plugins to extend Reactotron's functionality.

## What is a plugin?

A plugin is a way to extend Reactotron's functionality. Plugins can be used to add new features to Reactotron or to add support for new libraries.

## Installing a plugin

To install a plugin, you need to add it to your Reactotron client. You can do this by importing the plugin and passing it to the `use` method when you configure Reactotron.

```js
import Reactotron from "reactotron-react-native"

Reactotron.configure()
  .use(somePlugin())
  .connect()
```
