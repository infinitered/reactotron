// TODO: Name this better...
import React from "react"
import { Command } from "reactotron-core-contract"
import { CustomCommandsProvider, ReactNativeProvider, ReactotronProvider } from "reactotron-core-ui"

// import KeybindHandler from "./KeybindHandler"

/** Wrapper for Reactotron context providers */
export function ReactotronBrain({
  commands,
  sendCommand,
  clearCommands,
  addCommandListener,
  children,
}: {
  children: React.ReactNode
  commands: Command[]
  sendCommand: (type: string, payload: any, clientId?: string) => void
  clearCommands: () => void
  addCommandListener: (callback: (command: Command) => void) => void
}) {
  return (
    <ReactotronProvider
      commands={commands}
      sendCommand={sendCommand}
      clearCommands={clearCommands}
      addCommandListener={addCommandListener}
    >
      {/* <TimelineProvider> */}
      {/* <StateProvider> */}
      <CustomCommandsProvider>
        <ReactNativeProvider>
          {/* <KeybindHandler>{children}</KeybindHandler> */}
          {children}
        </ReactNativeProvider>
      </CustomCommandsProvider>
      {/* </StateProvider> */}
      {/* </TimelineProvider> */}
    </ReactotronProvider>
  )
}
