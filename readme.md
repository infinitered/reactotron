# ![CLI](./docs/images/readme/Reactotron-64.png) Reactotron

[![Join the chat at https://gitter.im/reactotron/reactotron](https://badges.gitter.im/reactotron/reactotron.svg)](https://gitter.im/reactotron/reactotron?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A CLI and OS X app for inspecting your [React JS](https://facebook.github.io/react/) and [React Native](https://facebook.github.io/react-native/) apps.

# Installing

## Install CLI with NPM

```sh
npm install -g reactotron-cli
```

## Install OS X application

[Download OS X App](https://github.com/reactotron/reactotron/releases/download/v1.0.0/Reactotron.app.zip) from GitHub release and drop the Reactotron.app to the Applications folder.

### Using Homebrew

Reactotron is also available via [Homebrew Cask](https://caskroom.github.io/) package manager. To ensure you get the latest version, update Homebrew first:

```sh
brew update
```

Then simply type:

```
brew cask install reactotron
```

# About

Use it to:

* view your application state
* show API requests & responses
* perform quick performance benchmarks
* subscribe to parts of your application state
* display messages similar to console.log
* track global errors with source-mapped stack traces
* dispatch actions like a government-run mind control experiment

You plug it into your app as a dev dependency so it adds nothing to your product builds.

The app comes in two forms, which share the same [back end](https://github.com/reactotron/reactotron/tree/master/packages/reactotron-core-server):

### Desktop

Reactotron on the left, demo React Native app on the right.

![Desktop](./docs/images/readme/reactotron-demo-app.gif)

### Command Line

![CLI](./docs/images/readme/reactotron-demo-cli.gif)


Welcome to flavour country.

# Quick Start

* See the [React JS Quick Start](docs/quick-start-react-js.md).
* See the [React Native Quick Start](docs/quick-start-react-native.md).

# Usage

* [Track Errors](docs/plugin-track-global-errors.md)
* Integrate with [Redux](docs/plugin-redux.md)
* Networking monitoring with [Apisauce](docs/plugin-apisauce.md)
* Start making fetch happen (plugin coming soon...)
* Creating Your Own Plugins (tutorial coming soon...)
* The JSON interface between client & server (coming soon...)


# Tips

### Remote JS Debugging on Android

You'll need to turn of remote JS debugging as it hijacks the websocket channel between your app & Reactotron.  I'm going to look into options.  :|


### Reverse Forwarding on Android

If you're running an android emulator and Android 5.x+ (or you're tethered on your device), then you'll need to forward port 9090 from your device back to your computer.

```sh
adb reverse tcp:9090 tcp:9090
```

### Running in Production Builds

Although I don't recommend this for security & privacy reasons, you may actually want to run Reactotron in a production build (please please don't ship to the AppStore with it enabled.  <3).

A few changes you'll need to make is to install Reactotron with `--save` instead of `--save-dev`.  From there, you're good to go.  But you also might want to consider calling `Reactotron.connect()` if you're in `__DEV__` mode.

Here's a few us chatting about this subject:

https://github.com/reactotron/reactotron/issues/173


# Special Thanks

Reactotron is sponsored by [Infinite Red](https://infinite.red) who encourage this type of open-source hacking & sharing.  They specialize in React, React Native, and Elixir. <3

[<img src='https://infinite.red/images/ir-logo-7ebf9ed9d02e2805bb2c94309efa5176.svg' />](https://infinite.red)

# Change Log

* August 23rd, 2016 - [1.0.1](https://github.com/reactotron/reactotron/releases/tag/v1.0.1)
* August 23rd, 2016 - [1.0.0](https://github.com/reactotron/reactotron/releases/tag/v1.0.0)
* August 21st, 2016 - [0.94.0](https://github.com/reactotron/reactotron/releases/tag/v0.94.0)
* August 18th, 2016 - [0.93.0](https://github.com/reactotron/reactotron/releases/tag/v0.93.0)
* August 16th, 2016 - [0.92.0](https://github.com/reactotron/reactotron/releases/tag/v0.92.0)
* August 9th, 2016 - [0.9.0](https://github.com/reactotron/reactotron/releases/tag/v0.9.0)
* July 29th, 2016 - [0.8.0](https://github.com/reactotron/reactotron/releases/tag/v0.8.0)
* July 15th, 2016 - [0.7.0](https://github.com/reactotron/reactotron/releases/tag/v0.7.0)
* April 27th, 2016 - [0.6.1](https://github.com/reactotron/reactotron/releases/tag/v0.6.1)
* April 24th, 2016 - [0.6.0](https://github.com/reactotron/reactotron/releases/tag/v0.6.0)
* April 23rd, 2016 - [0.5.0](https://github.com/reactotron/reactotron/releases/tag/v0.5.0)
* April 23rd, 2016 - [0.4.0](https://github.com/reactotron/reactotron/releases/tag/v0.4.0)
* April 22nd, 2016 - [0.3.0](https://github.com/reactotron/reactotron/releases/tag/v0.3.0)
* April 21st, 2016 - [0.2.0](https://github.com/reactotron/reactotron/releases/tag/v0.2.0)
* April 20th, 2016 - [0.2.0](https://github.com/reactotron/reactotron/releases/tag/v0.1.0)
