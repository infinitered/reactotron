// TODO: Name this better...
import React, { FunctionComponent } from "react"

import { ReactotronProvider, Command } from "./contexts/Reactotron"
import { TimelineProvider } from "./contexts/Timeline"
import { StateProvider } from "./contexts/State"
import { CustomCommandsProvider } from "./contexts/CustomCommands"
import { ReactNativeProvider } from "./contexts/ReactNative"
import KeybindHandler from "./KeybindHandler"

interface Props {
  commands: Command[]
  sendCommand: (type: string, payload: any, clientId?: string) => void
  addCommandListener: (callback: (command: Command) => void) => void
}

const ReactotronBrain: FunctionComponent<Props> = ({
  commands,
  sendCommand,
  addCommandListener,
  children,
}) => {
  return (
    <ReactotronProvider
      commands={commands}
      sendCommand={sendCommand}
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
