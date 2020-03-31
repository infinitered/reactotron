# Getting Started

Reactotron has the ability to connect to the [standalone](https://github.com/infinitered/reactotron/releases) app or, if configured, connect to flipper using the reactotron [flipper](https://fbflipper.com) plugin.

# React Native

- Install `reactotron-react-native` into your project

```
npm i --save-dev reactotron-react-js

or

yarn add reactotron-react-js --dev
```

- Next you will need to decide where to put your reactotron configuration. Typically you would want this in its own file to keep things together.

```javascript
// File Name: ReactotronConfig.js (or similar)
import Reactotron from 'reactotron-react-native'

Reactotron
  .setAsyncStorageHandler(AsyncStorage) // AsyncStorage would come from `@react-native-community/async-storage`
  .configure() // we can use plugins here -- more on this later
  .useReactNative() // Add built in react-native plugins. There is configurate you can do here. More on that later
  .connect() // let's connect!
```

- Import your reactotron config file somewhere at the beginning of your app

```javascript
import './ReactotronConfig'
```

- At this point reactotron should be sending some data. We will work on hooking more up in the next section.


# React JS

- Install `reactotron-react-js` into your project

```
npm i --save-dev reactotron-react-js

or

yarn add reactotron-react-js --dev
```

- Next you will need to decide where to put your reactotron configuration. Typically you would want this in its own file to keep things together.

```javascript
// File Name: ReactotronConfig.js (or similar)
import Reactotron from 'reactotron-react-js'

Reactotron
  .configure() // we can use plugins here -- more on this later
  .connect() // let's connect!
```

- Import your reactotron config file somewhere at the beginning of your app

```javascript
import './ReactotronConfig'
```

- At this point reactotron should be sending some data. We will work on hooking more up in the next section.

<!-- TODO: Write this part of the documentation -->
<!-- # Installing Reactotron in Flipper plugin

TODO - Write these -->
