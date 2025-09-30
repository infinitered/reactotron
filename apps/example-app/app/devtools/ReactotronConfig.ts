/**
 * This file does the setup for integration with Reactotron, which is a
 * free desktop app for inspecting and debugging your React Native app.
 * @see https://github.com/infinitered/reactotron
 */
import { Platform, TurboModuleRegistry } from "react-native"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { ArgType } from "reactotron-core-client"
import { mst } from "reactotron-mst"
import apisaucePlugin from "reactotron-apisauce"
import { reactotronRedux } from "reactotron-redux"

import { clear } from "app/utils/storage"
import { goBack, resetRoot, navigate } from "app/navigators/navigationUtilities"

import { Reactotron } from "./ReactotronClient"

const reactotron = Reactotron.configure({
  name: require("../../package.json").name,
  onConnect: () => {
    /** since this file gets hot reloaded, let's clear the past logs every time we connect */
    Reactotron.clear()
  },
})
  .use(apisaucePlugin({ ignoreContentTypes: /^(image)\/.*$/i }))
  .use(reactotronRedux())
  .use(
    mst({
      /** ignore some chatty `mobx-state-tree` actions  */
      filter: (event) => /postProcessSnapshot|@APPLY_SNAPSHOT/.test(event.name) === false,
    })
  )

if (Platform.OS !== "web") {
  reactotron.setAsyncStorageHandler?.(AsyncStorage)
  reactotron.useReactNative({
    networking: {
      ignoreUrls: /(logs|symbolicate)$/,
    },
    overlay: true,
  })
}

type Arg<AN extends string, AT extends ArgType = ArgType.String> = {
  name: AN
  type: AT
  placeholder?: string
  hidden?: boolean
}

/**
 * Reactotron allows you to define custom commands that you can run
 * from Reactotron itself, and they will run in your app.
 *
 * Define them in the section below with `onCustomCommand`. Use your
 * creativity -- this is great for development to quickly and easily
 * get your app into the state you want.
 *
 * NOTE: If you edit this file while running the app, you will need to do a full refresh
 * or else your custom commands won't be registered correctly.
 */

/**
 * This Platform.OS iOS restriction can be lifted in React Native 0.77
 * The `DevMenu` module was missing in Android for the New Architecture
 * See this PR for more details: https://github.com/facebook/react-native/pull/46723
 */
if (Platform.OS === "ios") {
  reactotron.onCustomCommand({
    title: "Show Dev Menu",
    description: "Opens the React Native dev menu",
    command: "showDevMenu",
    handler: () => {
      Reactotron.log("Showing React Native dev menu")
      TurboModuleRegistry.get<{ show: () => void; getConstants: () => {} }>("DevMenu")?.show()
    },
  })
}

reactotron.onCustomCommand({
  title: "Reset Root Store",
  description: "Resets the MST store",
  command: "resetStore",
  handler: () => {
    Reactotron.log("resetting store")
    clear()
  },
})

reactotron.onCustomCommand({
  title: "Reset Navigation State",
  description: "Resets the navigation state",
  command: "resetNavigation",
  handler: () => {
    Reactotron.log("resetting navigation state")
    resetRoot({ index: 0, routes: [] })
  },
})

reactotron.onCustomCommand<[Arg<"route">]>({
  command: "navigateTo",
  handler: (args) => {
    const { route } = args ?? {}
    if (route) {
      Reactotron.log(`Navigating to: ${route}`)
      navigate(route as any) // this should be tied to the navigator, but since this is for debugging, we can navigate to illegal routes
    } else {
      Reactotron.log("Could not navigate. No route provided.")
    }
  },
  title: "Navigate To Screen",
  description: "Navigates to a screen by name.",
  args: [{ name: "route", type: ArgType.String }],
})

reactotron.onCustomCommand({
  title: "Go Back",
  description: "Goes back",
  command: "goBack",
  handler: () => {
    Reactotron.log("Going back")
    goBack()
  },
})

reactotron.onCustomCommand<[Arg<"data">]>({
  title: "Log hidden data",
  description: "Logs hidden input data",
  command: "logHiddenData",
  handler: (args) => {
    Reactotron.log(`Hidden data: ${args?.data}`)
  },
  args: [
    {
      name: "data",
      placeholder: "Provide hidden data",
      hidden: true,
      type: ArgType.String,
    },
  ],
})

/**
 * We're going to add `console.tron` to the Reactotron object.
 * Now, anywhere in our app in development, we can use Reactotron like so:
 *
 * ```
 * if (__DEV__) {
 *  console.tron.display({
 *    name: 'JOKE',
 *    preview: 'What's the best thing about Switzerland?',
 *    value: 'I don't know, but the flag is a big plus!',
 *    important: true
 *  })
 * }
 * ```
 *
 * Use this power responsibly! :)
 */
console.tron = reactotron

/**
 * We tell typescript about our dark magic
 *
 * You can also import Reactotron yourself from ./reactotronClient
 * and use it directly, like Reactotron.log('hello world')
 */
declare global {
  interface Console {
    /**
     * Reactotron client for logging, displaying, measuring performance, and more.
     * @see https://github.com/infinitered/reactotron
     *
     * @example
     * if (__DEV__) {
     *  console.tron.display({
     *    name: 'JOKE',
     *    preview: 'What's the best thing about Switzerland?',
     *    value: 'I don't know, but the flag is a big plus!',
     *    important: true
     *  })
     * }
     *
     */
    tron: typeof reactotron
  }
}

/**
 * Now that we've setup all our Reactotron configuration, let's connect!
 */
reactotron.connect()

export default reactotron
