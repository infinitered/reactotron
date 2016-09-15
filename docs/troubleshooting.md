# Troubleshooting

Here are some notes about common things that go off the rails.

## General Discomfort

#### Missing Libraries with NPM 2.x

Life is better with NPM 3.x. NPM 2.x kept nested dependencies in sub-folders.  In version 3, they try to flatten as many dependencies up to the `node_modules` level.

As a result, you will discover things missing like `ramda` and `socket.io-client`.  

Either upgrade to NPM 3 or teach me how to fix this!  It must be possible!  Help!

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
