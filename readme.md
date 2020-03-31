# Reactotron

[![CircleCI](https://circleci.com/gh/infinitered/reactotron.svg?style=svg)](https://circleci.com/gh/infinitered/reactotron)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![react native newsletter](https://img.shields.io/badge/React%20Native%20Newsletter-Featured-blueviolet)](https://reactnative.cc)

_Watch [Darin Wilson's](https://github.com/darinwilson) talk at [Chain React](https://infinite.red/ChainReactConf): [Chain React 2018: Debugging and Beyond with Reactotron](https://www.youtube.com/watch?v=UiPo9A9k7xc)!_

# Why use Reactotron?

- View application state for [Redux](https://redux.js.org/) and [mobx-state-tree](https://mobx-state-tree.js.org/)
- View API requests and responses
- Track [Redux Sagas](https://redux-saga.js.org/)
- Integration with [Flipper](https://fbflipper.com)

# Quick Start

- If you plan to use the standalone reactotron [download it](https://github.com/infinitered/reactotron/releases)
- If you plan to use reactotron in [Flipper](https://fbflipper.com) download it and add the reactotron plugin
- Install the `reactotron-react-js` or `reactotron-react-native` depending on the type of project you are working on
- Setup a configuration file like this

```javascript
// React Native
import Reactotron from 'reactotron-react-native'

Reactotron
  .setAsyncStorageHandler(AsyncStorage) // AsyncStorage `@react-native-community/async-storage`.
  .configure()
  .useReactNative()
  .connect()
```

```javascript
// React JS
import Reactotron from 'reactotron-react-js'

Reactotron
  .configure()
  .connect()
```

- Thats it! You should be seeing some data come in from your app

# Credits

Reactotron is developed by [Infinite Red](https://infinite.red), [@rmevans9](https://github.com/rmevans9), and 70+ amazing contributors! Special thanks to [@skellock](https://github.com/skellock) for originally creating Reactotron while at Infinite Red.
