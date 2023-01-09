import { Alert/*, AsyncStorage */ } from "react-native"
import AsyncStorage from "@react-native-community/async-storage"
import Reactotron from "reactotron-react-native"
import { reactotronRedux as reduxPlugin } from "reactotron-redux"
import sagaPlugin from "reactotron-redux-saga"
import { mst } from "reactotron-mst"
import { ArgType } from "reactotron-core-client"

Reactotron.configure({
  name: "Demo App",
})

Reactotron.setAsyncStorageHandler(AsyncStorage)

Reactotron.useReactNative({
  asyncStorage: {
    ignore: ["ignore-me"],
  },
})

Reactotron.use(reduxPlugin())
Reactotron.use(sagaPlugin({}))
Reactotron.use(mst())

Reactotron.onCustomCommand("test", () => console.log("This is an example"))

Reactotron.onCustomCommand({
  command: "test2",
  handler: params => {
    Alert.alert("A message from Reactotron", params.message)
  },

  // Optional settings
  title: "Show a message",
  description: "Alert in the app for absolutely no reason at all.",
  args: [
    {
      name: "message",
      type: ArgType.String,
    },
  ],
})

const selfRemoving = Reactotron.onCustomCommand({
  command: "remove",
  handler: () => {
    selfRemoving()
  },
})

Reactotron.connect()
Reactotron.clear()

const aThing = {
  aFunc: () => {
    return 10
  },
  aVal: "Test",
  aObj: {
    nested: true,
    num: 12312314,
  },
  aArr: [1, "two", { three: true }],
}

Reactotron.repl("thing", aThing)

Reactotron.repl("aString", "Hello")

const anotherTHing = [1, 2, { how: { awesome: { iz: { allThis: true } } } }]

Reactotron.repl("anotherThing", anotherTHing)
