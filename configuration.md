# Configuration

When calling Reacotrons `configure` method you can pass options.

```javascript
import Reactotron from 'reactotron-react-native' // or 'reactotron-react-js'

Reactotron.configure({
  createStocket: () => {}, // TODO: Document
  host: '10.0.0.1', // TODO: Document
  port: 9090, // TODO: Document
  name: 'My Awesome App', // TODO: Document
  secure: true, // TODO: Document. Do we need to?
  onCommand: () => {}, // TODO: Document
  onConnect: () => {}, // TODO: Document
  onDisconnect: () => {}, // TODO: Document
  setClientId: () => {}, // TODO: Document
  getClientId: () => {}, // TODO: Document
})
```

TODO: Document `use`.

```javascript
Reactotron.use((reactotron) => {
  // You get access to the reactotron instance so you can attach event listeners
  // so you can react to events coming through reactotron or event transmit your own events.
})
```

TODO: Document all the good things about .useReactNative here!
```javascript
Reactotron.useReactNative({
  // Global Error Tracking
  // errors: false, // Passing false turns off this plugin
  // errors: true, // Turn it on but don't care about the options
  errors: { // Turn it on with some options
    veto: (frame) => { return false; }
  },

  // Open in editor
  editor: {
    url: 'http://localhost:8081' // URL to the react native metro bundler
  },

  // React Native Overlay
  overlay: true, // No options, just true or false.

  // React Native Async Storage
  asyncStorage: {
    ignore: ['keys', 'to', 'ignore'] // An array of async storage keys to not track
  },

  // React Native Network Tracking
  networking: {
    ignoreContentTypes: /[a-z]/g, // Regex to ignore certain content types
    ignoreUrls: /[a-z]/g, // Regex to ignore certain urls
  },

  // React Native storybook support
  storybook: true, // No options, just true or false.

  // React Native dev tools support
  devTools: true, // No options, just true or false.
})
```
