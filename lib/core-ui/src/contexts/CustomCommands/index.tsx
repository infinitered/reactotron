import React, { FunctionComponent, useContext, useCallback } from "react"

import ReactotronContext from "../Reactotron"

import useCustomCommands, { CustomCommand } from "./useCustomCommands"

interface Context {
  customCommands: CustomCommand[]
  sendCustomCommand: (command: any, args: any) => void
}

const CustomCommandsContext = React.createContext<Context>({
  customCommands: [],
  sendCustomCommand: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  const { sendCommand } = useContext(ReactotronContext)
  const { customCommands } = useCustomCommands()

  const sendCustomCommand = useCallback(
    (command, args) => {
      sendCommand("custom", { command, args })
    },
    [sendCommand]
  )

  return (
    <CustomCommandsContext.Provider
      value={{
        customCommands,
        sendCustomCommand,
      }}
    >
      {children}
    </CustomCommandsContext.Provider>
  )
}

export default CustomCommandsContext
export const CustomCommandsProvider = Provider
