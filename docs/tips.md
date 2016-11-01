# Tips and Tricks

### Clearing Reactotron

You can clear Reactotron by calling `clear()`.

For example, let's say in React Native you want to clear the logs everytime you start up?  Add this to your app's `ReactotronConfig.js`:

```js
Reactotron.clear()
```

### Running In Production

Don't... said the stranger on the Internet pretending he knows what's best for you.

Please install `reactotron-react-native`, `reactotron-react-js`, and others with `--save-dev` instead of `--save`.

#### React Native

For React Native apps, there's several good reasons.

1. Battery life.  WebSockets will drain the battery as the connection stays open.
2. Privacy.  Your app might store stuff in state that the user realize... like social tokens.
3. Security.  You can literally remote control parts of the app.  Yikes!

Surround your Reactotron activities with:

```js
if (__DEV__) {
  // ZAP!
}
```

This means you'll need to be careful to use `require()` instead of `import` as `import` in ES6 are hoisted!

**Flip Flop Alert!** Technically it's possible just to NPM `--save`.  Maybe you want to do some debugging on a production build on a local device?  That's cool.  Just please, don't ship without conditionally shutting off `Reactotron.connect()`.  <3


#### React JS

For web sites, well... CORS browser security will pretty much shut you down anyway.

If you're running ReactJS and webpack, anything inside `false` expressions will get nuked in production builds.

```js
if (process.env.NODE_ENV !== 'production') {
  // ZAP!
}
```

### Piggybacking on Console

In ES6, you must import Reactotron at the top of your file before using it like this:

```js
import Reactotron from 'reactotron-react-native'
// or import Reactotron from 'reactotron-react-native'
```

And later on in your file, you type:

```js
Reactotron.log('something really interesting happened')
```

You can cut out the top step by attaching to the `console` object in your `ReactotronConfig.js` file (or wherever you setup).

```js
// horrible, but useful hack.... oh come on, don't look at me like that... it's JavaScript :|
console.tron = Reactotron
```

Now, anywhere in your app if you want to log something?

```js
console.tron.log('Sweet Freedom!')
```

### Fancy Console Magic :tophat: :sparkles:

You can add an important indicator light on any log by adding `true` as a second parameter.  _E.g._
```js
// or Reactotron.log
console.tron.log('I am important', true)
```

Additionally, you can access a more advanced message and indicator with `display`.
```js
// or Reactotron.display
console.tron.display({
  name: 'Tacos',
  value: {a: 1, b: [1,2,3]},
  preview: 'when you click here, it might surprise you!',
  important: true,
  image: 'http://placekitten.com/g/400/400'
})
```
