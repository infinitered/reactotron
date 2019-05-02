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
  handler: () => console.log("This is an example 2"),

  // Optional settings
  title: "A thing",
  description: "The desc",
})

const selfRemoving = Reactotron.onCustomCommand({
  command: "remove",
  handler: () => {
    selfRemoving()
  },
})

Reactotron.connect()
Reactotron.clear()
