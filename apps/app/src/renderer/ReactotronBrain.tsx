// TODO: Name this better...
import React, { FunctionComponent, PropsWithChildren } from "react"
import { ReactotronProvider as _ReactotronProvider, CustomCommandsProvider, ReactNativeProvider, TimelineProvider, StateProvider, ReactotronContext } from "reactotron-core-ui"
import type { Command } from "reactotron-core-ui/dist/types/types"
import { InferContextValue } from "./contexts/utility"

import KeybindHandler from "./KeybindHandler"

// TODO: update ReactotronProvider export from reactotron-core-ui to use PropsWithChildren type 
type ReactotronProviderProps = Pick<InferContextValue<typeof ReactotronContext>, 'commands' | 'sendCommand' | 'clearCommands' | 'addCommandListener'>
type FixedReactotronProvider = React.FC<PropsWithChildren<ReactotronProviderProps>>
const ReactotronProvider = _ReactotronProvider as FixedReactotronProvider

interface Props {
  commands: Command[]
  sendCommand: (type: string, payload: any, clientId?: string) => void
  clearCommands: () => void
  addCommandListener: (callback: (command: Command) => void) => void
}

/** Wrapper for Reactotron context providers */
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
