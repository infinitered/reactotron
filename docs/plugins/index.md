# Reactotron Plugins

Reactotron has a powerful plugin system with ready-made plugins for you to use in your app. You can also create your own plugins to extend Reactotron's functionality.

## What is a plugin?

A plugin is a way to extend Reactotron's functionality. Plugins can be used to add new features to Reactotron or to add support for new libraries.

## Installing a plugin

To install a plugin, you need to add it to your Reactotron client. You can do this by importing the plugin and passing it to the `use` method when you configure Reactotron.

```js
import Reactotron from "reactotron-react-native"

Reactotron.configure().use(somePlugin()).connect()
```

# Community-made plugins

Anyone can make a Reactotron plugin! If you've made a plugin, please open a PR to add it to this list.

> Note that Infinite Red does not maintain these plugins and can not guarantee compatibility or effectiveness. If you have questions about a plugin, please contact the plugin author.

- [reactotron-react-query](https://github.com/hsndmr/reactotron-react-query)
