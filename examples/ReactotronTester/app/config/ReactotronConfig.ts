import { Alert } from "react-native"
import Reactotron from "reactotron-react-native"
import { reactotronRedux as reduxPlugin } from "reactotron-redux"
import sagaPlugin from "reactotron-redux-saga"
import { mst } from "reactotron-mst"

Reactotron.configure({
  name: "Demo App",
})

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
      type: "string",
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
