# Troubleshooting

Here are some notes about common things that go off the rails.

## React Native iOS

#### Tethered and Can't Connect?

If you have tethered an iOS device to your development machine and have deployed your React Native app (in DEBUG mode) to the device, Reactotron needs to know the host of the machine in order to connect.

Go to the file in your React Native app that configures Reactotron. This file is named "ReactotronConfig.js". Uncomment the 'host' line under `.configure` and set it to the ip address of your host machine. Don't forget to add a comma after this line!

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

#### Using Expo and Can't Connect?
Make sure you are running your app using the command:

    exp start --localhost

Otherwise the app is not using the port 9000.

#### Tethered and Can't Connect?

If you're using an emulator like Genymotion or the one in Android Studio, or even if your own device, you can still use localhost (the default) to connect provided you __port forward__ back to your computer.

While plugged in type:

```sh
adb reverse tcp:9090 tcp:9090
```

and reload the app on your device.

This only works on Android 5.x+.

As of 1.1.4, the proper IP address is auto-discovered.  Simply leave the `configure` as is.
