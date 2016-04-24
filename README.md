# Reactotron

[![npm module](https://badge.fury.io/js/reactotron.svg)](https://www.npmjs.org/package/reactotron)

Control, monitor, and instrument your React DOM and React Native apps.  From the comfort of your TTY.

<img src='./images/Reactotron.gif' alt="Hello!" />

<img src='./images/0.2.0.gif' alt="Hello!" />

### Platforms Supported

* React Native 0.23+
* React DOM 15+
* [React Native Web](https://github.com/necolas/react-native-web) 0.0.15+

### Great For

* sending logging commands as text or objects
* relaying all redbox errors and yellowbox warnings
* watching the flow of actions as they get dispatched
* tracking performance of each action watching for hotspots
* querying your global state like a database
* subscribing to values in your state and be notified when they change
* dispatching your custom actions
* watching your HTTP calls to servers and track timing

# Requirements

* Node 4.x+
* Abnormal love for all things console


# Installing

`npm install reactotron --save-dev`


# Running The Server

`node_modules/.bin/reactotron`

Might be worth creating an alias or adding it to your script section of your `package.json`.

# How To Use

To use this, you need to add a few lines of code to your app.

Depending on how much support you'd like, there's a few different places you'll want to hook in.

### Entry Point (required)

##### Provides

* sending logging commands as text or objects
* relaying all redbox errors and yellowbox warnings

<img src='./images/Yellowbox.png' alt="Hello!" />

##### How To Hook

If you have `index.ios.js` or `index.android.js`, you can place this code somewhere near the top:

```js
import Reactotron from 'reactotron'

// connect with defaults
Reactotron.connect()

// Connect with options

const options = {
  name: 'React Web', // Display name of the client
  server: 'localhost', // IP of the server to connect to
  port: 3334, // Port of the server to connect to (default: 3334)
  enabled: true // Whether or not Reactotron should be enabled.
}

Reactotron.connect(options)
```

I'd recommend using the following for connect in React Native so that release builds will disable reactotron.

```js
Reactotron.connect({enabled: __DEV__})
```

##### Ensure `connect()` Happens First

It is important that your `Reactotron.connect()` happens before your redux store gets created.  Especially
if you're using the `{enabled: false}` option.

To make this happen, you can create a `ReactotronConfig.js` file and `import` that as your first import in
the entry point of your application.  Check out the 3 projects under `examples` to see that in action.


### Redux Middleware (optional)

<img src='./images/ReduxActions.png' alt="Hello!" />

##### Provides

* watching the flow of actions as they get dispatched
* tracking performance of each action watching for hotspots

##### Hook To Hook

```js
// wherever you create your Redux store, add the Reactotron middleware:

import Reactotron from 'reactotron'

const store = createStore(
  rootReducer,
  applyMiddleware(
    logger,
    Reactotron.reduxMiddleware // <--- here i am!
  )
)

// Or you can use the Reactotron storeEnhancer!

const enhancer = compose(
  // If you have other enhancers..
  Reactotron.storeEnhancer()
)

const store = createStore(
  rootReducer,
  initialState,
  enhancer
)

```

### Redux Store (optional)

<img src='./images/ReduxSubscriptions.png' alt="Hello!" />

##### Provides

* querying your global state like a database
* subscribing to values in your state and be notified when they change
* dispatching your custom actions

##### How To Hook

```js
// wherever you create your Redux store
import Reactotron from 'reactotron'

const store = createStore(...)  // however you create your store
Reactotron.addReduxStore(store) // <--- here i am!

// If you're using the Reactotron.storeEnhance(), it's already
// setup for you!
```

### API Tracking (optional)

<img src='./images/Api.png' alt="Hello!" />

##### Provides

* watching your HTTP calls to servers and track timing
* currently supports [apisauce](https://github.com/skellock/apisauce)

##### How To Hook

```js
// wherever you create your API
import Reactotron from 'reactotron'

// with your existing api object, add a monitor
api.addMonitor(Reactotron.apiLog)
```

# Other Features

##### Log

Call `Reactotron.log()` and pass a string or object to have it log.  Emojis are supported.

##### Bench

You can use Reactotron for unscientific benchmarks.

```javascript
  const bench = Reactotron.bench('Here I Go')
  bench.stop()
```

You can also register steps if you're timing a sequence.
```javascript
  const bench = Reactotron.bench('Lets Go')
  bench.step('After long operation')
  bench.step('After one more thing')
  bench.stop()
```

# Tips

##### Using With Android

If you're using an Android sim and it's running 5.x or higher, you can use `adb` to port forward
the right TCP port to the `reactotron` server.

`$ANDROID_HOME/platform-tools/adb reverse tcp:3334 tcp:3334`

##### Using On A Device

When you initialize the `reactotron` you can tell it the server location when you connect:

`Reactotron.connect({server: '10.0.1.109'})`

##### Useful shortcuts

You can clear your reactotron by hitting backspace/delete OR you can insert a separator by pressing the "-" key.

For some commands, like dispatching an action, you can repeat previous by pressing the "." key.


# Getting Involved

PRs and bug reports are welcome!

You want to start extending this?

### Run the console program

```
cd src
npm install
npm start
```

### Pick an example app and run it

```
cd examples/ReactNativeExample
npm install
cp ../../src/client/client.js .
react-native run-ios
```

Then hack around.  Hack around.  Hack up hack up and hack down.

Be sure to read the silly `examples/README.md` file for more details.


# Wishlist

* [ ] Get the vocab right (current everything is a "command")
* [ ] Refactor clients to organize commands
* [ ] Allow commands to be extended on client & server
* [ ] Allow a .reactotron sub-folder for project-specific things
* [ ] Does router need to exist anymore?
* [ ] Api size metrics
* [ ] Pages for logging
* [ ] Show what the profile shows
* [ ] Track saga effect chains
* [ ] Provide a way to drive the navigator
* [ ] Allow simple scripts to be written that send commands
* [ ] Strategy for dealing with multiple apps connecting

# Random Pics

<img src='./images/AllThreePlatforms.png' alt="Hello!" />

<img src='./images/MainInterface.png' alt="Hello!" />

<img src='./images/Dispatch.png' alt="Hello!" />

# Special Thanks

A shout out to my teammates at [Infinite Red](https://infinite.red) who encourage this type of open-source hacking & sharing.

[<img src='https://infinite.red/images/ir-logo-7ebf9ed9d02e2805bb2c94309efa5176.svg' />](https://infinite.red)

Also, to [Kevin VanGelder](https://github.com/kevinvangelder),
who spawned the idea for this library by saying, "Hey, you know what would
be cool? A REPL. We should do that."

# Change Log

See the full [CHANGES.md](CHANGES.md) file.

