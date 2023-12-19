// TODO: Name this better...
import React, { PropsWithChildren, useCallback, useEffect, useRef } from "react"
import {
  ReactotronProvider,
  CustomCommandsProvider,
  ReactNativeProvider,
  TimelineProvider,
  StateProvider,
} from "reactotron-core-ui"

import KeybindHandler from "./KeybindHandler"
import { useStore } from "./models/RootStore"
import Server, { createServer } from "reactotron-core-server"
import config from "./config"
import { observer } from "mobx-react-lite"

/** Wrapper for Reactotron context providers */
const ReactotronBrain = ({ children }: PropsWithChildren) => {
  const reactotronServer = useRef<Server>(null)
  const store = useStore()

  useEffect(() => {
    // Creates a server and starts listening for connections
    reactotronServer.current = createServer({ port: config.get("serverPort") as number })

    reactotronServer.current.on("start", () => {
      store.setProp("serverStatus", "started")
    })

    reactotronServer.current.on("stop", () => {
      store.setProp("serverStatus", "stopped")
    })

    // @ts-expect-error need to sync these types between reactotron-core-server and reactotron-app
    reactotronServer.current.on("connectionEstablished", (connection: Connection) => {
      store.addConnection(connection)
    })

    // @ts-expect-error need to sync these types between reactotron-core-server and reactotron-app
    reactotronServer.current.on("disconnect", (connection: Connection) => {
      store.removeConnection(connection)
    })

    reactotronServer.current.on("command", (command: any) => {
      store.commandReceived(command)
    })

    reactotronServer.current.on("portUnavailable", () => {
      store.setProp("serverStatus", "portUnavailable")
    })

    // Start the server
    reactotronServer.current.start()

    // Stop the server when the app closes
    return () => {
      reactotronServer.current.stop()
    }
  }, [store])

  const sendCommand = useCallback(
    (type: string, payload: any, clientId?: string) => {
      // TODO: Do better then just throwing these away...
      if (!reactotronServer.current) return

      reactotronServer.current.send(type, payload, clientId)
    },
    [reactotronServer]
  )

  return (
    <ReactotronProvider
      commands={store.currentCommands}
      sendCommand={sendCommand}
      clearCommands={store.clearCommands}
      addCommandListener={store.addCommandListener}
    >
      <TimelineProvider>
        <StateProvider>
          <CustomCommandsProvider>
            <ReactNativeProvider>
              <KeybindHandler>{children}</KeybindHandler>
            </ReactNativeProvider>
          </CustomCommandsProvider>
        </StateProvider>
      </TimelineProvider>
    </ReactotronProvider>
  )
}

export default observer(ReactotronBrain)
