// TODO: Name this better...
import React, { FunctionComponent } from "react"
import { ReactotronProvider, CustomCommandsProvider, ReactNativeProvider, TimelineProvider } from "reactotron-core-ui"
import { Command } from "reactotron-core-ui/dist/types/types"

import { StateProvider } from "./contexts/State"
import KeybindHandler from "./KeybindHandler"

interface Props {
  commands: Command[]
  sendCommand: (type: string, payload: any, clientId?: string) => void
  clearCommands: () => void
  addCommandListener: (callback: (command: Command) => void) => void
}

const ReactotronBrain: FunctionComponent<Props> = ({
  commands,
  sendCommand,
  clearCommands,
  addCommandListener,
  children,
}) => {
  return (
    <ReactotronProvider
      commands={commands}
      sendCommand={sendCommand}
      clearCommands={clearCommands}
      addCommandListener={addCommandListener}
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

export default ReactotronBrain
