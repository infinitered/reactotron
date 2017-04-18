# Quick Start for React Native

## Installing Reactotron.app

Let’s [download the desktop app](./installing.md) to start.  It’s OS X only at this point, but will shortly make available on Windows and Linux.

Unzip & run.

![Installing The App](./images/quick-start-react-js/installing.jpg)


## From Scratch

Let's start a brand new app from scratch.  If you want to use your own, skip to the next section.

Download `react-native-cli` if you haven't yet:
```
npm i -g react-native-cli
```

Then spin up a brand new React Native app.
```
react-native init ReactotronDemo
cd ReactotronDemo
```

You'll need to run this in an emulator for Android or the simulator for iOS.  Facebook has some [great guides](http://facebook.github.io/react-native/docs/getting-started.html#content) on getting started.

## Installing Reactotron

Let's install Reactotron as a dev dependency.

```
npm i --save-dev reactotron-react-native
```

I like a separate file for initializing.  Create `ReactotronConfig.js` in your editor of choice and paste this:

```js
import Reactotron from 'reactotron-react-native'

Reactotron
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!
```

Finally, we import this on startup in `index.ios.js` and `index.android.js` on line 1:

```js
import './ReactotronConfig'
```

At this point, Reactotron is hooked up.

Refresh your app (or start it up `react-native start`) and have a look at Reactotron now.  Do you see the `CONNECTION` line?  Click that to expand.

![We Have Contact](./images/quick-start-react-native/first-connect.jpg)


Go back to your app and refresh it 5 or 6 times.  Now look.

![Chatty](./images/quick-start-react-native/spammy.jpg)

Pretty underwhelming huh?


## Hello World

Let's do some classic programming.

Open up `index.ios.js` or `index.android.js`.

Right after the line you just added in the previous step lets put this:

```js
import Reactotron from 'reactotron-react-native'
```

Next, inside the `render()` function, put this as the first line:

```js
Reactotron.log('hello rendering world')
```

Save that file and refresh your web page if you don't have live reloading.

Now Reactotron looks like this:

![Hello 1](./images/quick-start-react-native/hello-1.jpg)

While collapsed, the grey area to the right shows a preview.  Click to open.

![Hello 2](./images/quick-start-react-native/hello-2.jpg)

Let's change our log statement to:

```js
Reactotron.log({ numbers: [1, 2, 3], boolean: false, nested: { here: 'we go' } })
```

Or this

```js
Reactotron.warn('*glares*')
```

Or this

```js
Reactotron.error('Now you\'ve done it.')
```

Or this

```js
Reactotron.display({
  name: 'KNOCK KNOCK',
  preview: 'Who\'s there?',
  value: 'Orange.'
})

Reactotron.display({
  name: 'ORANGE',
  preview: 'Who?',
  value: 'Orange you glad you don\'t know me in real life?',
  important: true
})
```

## Now What?

Well, at this point, we have a complicated version of `console.log`.  

Where Reactotron starts to shine is when you start plugging into Redux, tracking global errors, and watching network requests.

Check out our [Demo](../packages/demo-react-native) for more goodies.

![Demo Native App](./images/quick-start-react-native/react-demo-native.jpg)

![Demo Reactotron](./images/quick-start-react-native/react-demo-native-reactotron.jpg)
