const en = {
  welcomeScreen: {
    title: "Reactotron",
    subtitle: "Kitchen Sink Demo App",
    message:
      "This demo app showcases what Reactotron can do... from networking to logging to plugins and more.",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
  },
  asyncStorageScreen: {
    title: "Reactotron will tell you when AsyncStorage values change!",
    set: "Async Storage SET",
    remove: "Async Storage REMOVE",
    clear: "Async Storage CLEAR",
  },
  benchmarkingScreen: {
    title: "Did you know Reactotron can benchmark your code? Check it out!",
    slow: "Slow Benchmarks",
    fast: "Fast Benchmarks",
  },
  customCommandsScreen: {
    title:
      "You can create lots of custom commands to make your app do things! It's like having react-native super powers!",
  },
  errorGeneratorScreen: {
    title: "Reactotron can log all different kinds of errors!",
    componentError: "Component Error",
    tryCatchError: "Try/Catch Error",
    reduxError: "Redux Error (sync)",
    reduxAsyncError: "Redux Error (async)",
  },
  loggingsScreen: {
    title: "Reactotron works with regular console.log statements! You can log, debug, and warn.",
    subtitle:
      "Reactotron has special commands that invoke even more power to display logs the way you want.",
  },
  mobxStateTreeScreen: {
    title: "MobX State Tree works great with Reactotron!",
  },
  networkingScreen: {
    title: "Reactotron automatically intercepts and logs network requests!",
    makeApiCall: "Make an API Call",
    makeFailingApiCall: "Make a failing API Call",
  },

  repos: {
    reactotron: "Reactotron",
    reactNative: "React Native",
    redux: "Redux",
    mobx: "MobX",
  },
  imageActions: {
    bigger: "Bigger",
    smaller: "Smaller",
    faster: "Faster",
    slower: "Slower",
    reset: "Reset",
  },
}

export default en
export type Translations = typeof en
