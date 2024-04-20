// TODO: Name this better...
import React, { FunctionComponent, PropsWithChildren } from "react"
import type { Command } from "reactotron-core-contract"
import {
  ReactotronProvider,
  CustomCommandsProvider,
  ReactNativeProvider,
  TimelineProvider,
  NetworkProvider,
  StateProvider,
} from "reactotron-core-ui"

import KeybindHandler from "./KeybindHandler"

interface Props {
  commands: Command[]
  sendCommand: (type: string, payload: any, clientId?: string) => void
  clearCommands: () => void
  clearNetworkCommands: () => void
  addCommandListener: (callback: (command: Command) => void) => void
}

/** Wrapper for Reactotron context providers */
const ReactotronBrain: FunctionComponent<PropsWithChildren<Props>> = ({
  commands,
  sendCommand,
  clearCommands,
  clearNetworkCommands,
  addCommandListener,
  children,
}) => {
  return (
    <ReactotronProvider
      commands={commands}
      sendCommand={sendCommand}
      clearCommands={clearCommands}
      clearNetworkCommands={clearNetworkCommands}
      addCommandListener={addCommandListener}
    >
      <NetworkProvider>
        <TimelineProvider>
          <StateProvider>
            <CustomCommandsProvider>
              <ReactNativeProvider>
                <KeybindHandler>{children}</KeybindHandler>
              </ReactNativeProvider>
            </CustomCommandsProvider>
          </StateProvider>
        </TimelineProvider>
      </NetworkProvider>
    </ReactotronProvider>
  )
}

export default ReactotronBrain
