# ![CLI](./docs/images/readme/Reactotron-64.png) Reactotron

[![Join the chat at https://gitter.im/reactotron/reactotron](https://badges.gitter.im/reactotron/reactotron.svg)](https://gitter.im/reactotron/reactotron?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[Less Talk More Action](./docs/installing.md)

# What is Reactotron?

A CLI and OS X app for inspecting your [React JS](https://facebook.github.io/react/) and [React Native](https://facebook.github.io/react-native/) apps.

Use it to:

* view your application state
* show API requests & responses
* perform quick performance benchmarks
* subscribe to parts of your application state
* display messages similar to console.log
* track global errors with source-mapped stack traces
* dispatch actions like a government-run mind control experiment
* hot swap your app's state
* track your sagas

You plug it into your app as a dev dependency so it adds nothing to your product builds.

The app comes in two forms which share the same [guts](https://github.com/reactotron/reactotron/tree/master/packages/reactotron-core-client):

### Desktop

Reactotron on the left, demo React Native app on the right.

![Desktop](./docs/images/readme/reactotron-demo-app.gif)

### Command Line

![CLI](./docs/images/readme/reactotron-demo-cli.gif)

Welcome to flavour country.


# Documentation

* [Installing](./docs/installing.md)
* Quick start for [React JS](./docs/quick-start-react-js.md)
* Quick start for [React Native](./docs/quick-start-react-native.md)
* [Tracking errors globally](./docs/plugin-track-global-errors.md)
* Integrating with [Redux](./docs/plugin-redux.md)
* Integrating with [Redux Saga](./docs/plugin-redux-saga.md)
* Networking monitoring with [Apisauce](./docs/plugin-apisauce.md)
* [Troubleshooting](./docs/troubleshooting.md)
* [Tips and Tricks](./docs/tips.md)
* [Release Notes](https://github.com/reactotron/reactotron/releases)

#### Coming Soon

* API Docs
* Integrating with Fetch
* Creating your own plugins
* The JSON interface between client & server (coming soon...)
* What's Inside This Repo?
* Contributors Quick Start


# Special Thanks

Reactotron is sponsored by [Infinite Red](https://infinite.red) who encourage this type of open-source hacking & sharing.  They specialize in React, React Native, and Elixir. :heart:

[<img src='https://infinite.red/images/ir-logo-7ebf9ed9d02e2805bb2c94309efa5176.svg' />](https://infinite.red)

Also, shout out to [Kevin VanGelder](https://github.com/kevinvangelder), who spawned the idea for Reactotron by saying, "Hey, you know what would be cool? A REPL. We should do that."  He singlehandedly devoured months of my spare time.
