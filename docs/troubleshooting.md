# Troubleshooting

Here are some notes about common things that go off the rails.

## General Discomfort

#### Missing Libraries with NPM 2.x

Life is better with NPM 3.x. NPM 2.x kept nested dependencies in sub-folders.  In version 3, they try to flatten as many dependencies up to the `node_modules` level.

As a result, you will discover things missing like `ramda` and `socket.io-client`.

Either upgrade to NPM 3 or teach me how to fix this!  It must be possible!  Help!

## React Native iOS

#### Tethered and Can't Connect?

If you have tethered an iOS device to your development machine and have deployed your React Native app (in DEBUG mode) to the device, Reactotron needs to know the host of the machine in order to connect.

Go to the file in your React Native app that configures Reactotron. This file is named "Reactotron.config". Uncomment the 'host' line under `.configure` and set it to the ip address of your host machine. Don't forget to add a comma after this line!

The configuration should look something like this:

```js
if (__DEV__) {
  Reactotron
    .configure({
      host: '<machine host ip>', // default is localhost (on android don't forget to `adb reverse tcp:9090 tcp:9090`)
      name: 'Ignite App' // would you like to see your app's name?
    })
```


Stop the React Native packager and re-deploy the app to your tethered iOS device. When the app starts up, Reactotron will connect to your machine's ip address.

## React Native Android

#### Tethered and Can't Connect?

If you're using an emulator like Genymotion or the one in Android Studio, or even if your own device, you can still use localhost (the default) to connect provided you __port forward__ back to your computer.

While plugged in type:

```sh
adb reverse tcp:9090 tcp:9090
```

This only works on Android 5.x+.

As of 1.1.4, the proper IP address is auto-discovered.  Simply leave the `configure` as is.

#### Turn Off Remote JS Debugging

You'll need to turn of remote JS debugging as it hijacks the websocket channel between your app & Reactotron.

[@zalmoxisus](https://github.com/zalmoxisus) has let me know that it is a React Native >= 0.31 [specific issue](https://github.com/facebook/react-native/issues/9523).

Hopefully we can delete this section soon.

### Stack Overflow Error While Logging?

There's an issue with one of the dependencies (socket.io) where trying to `console.tron.log` something that has a
circular reference will result in a stack overflow.

So in `@1.5.2`, we implemented a safety check to repair any problems with that.

Problem is, it's slow for extremely large payloads.  You can turn this off in `@1.5.3` by adding `safeRecursion: false`
into your `configure({})` statement in your `ReactotronConfig.js`.

A longer term fix is on the way.  And I'm looking forward to the day I can delete this section.
