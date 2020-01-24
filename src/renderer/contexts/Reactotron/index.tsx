import React, { FunctionComponent } from "react"
import { CommandType } from "reactotron-core-ui"

import useReactotron from "./useReactotron"

// TODO: Move up to better places like core somewhere!
export interface Command {
  id: number
  type: CommandType
  connectionId: number
  clientId?: string
  date: Date
  deltaTime: number
  important: boolean
  messageId: number
  payload: any
}

interface Props {
  commands: Command[]
  sendCommand: (type: string, payload: any, clientId?: string) => void
  clearCommands: () => void
  addCommandListener: (callback: (command: Command) => void) => void
}

interface ContextProps extends Props {
  // Command Events
  addCommandListener: (callback: (command: Command) => void) => void

  // Dispatch Modal
  isDispatchModalOpen: boolean
  dispatchModalInitialAction: string
  openDispatchModal: (initialAction: string) => void
  closeDispatchModal: () => void

  // Subscription Modal
  isSubscriptionModalOpen: boolean
  openSubscriptionModal: () => void
  closeSubscriptionModal: () => void
}

const ReactotronContext = React.createContext<ContextProps>({
  commands: [],
  sendCommand: null,
  clearCommands: null,
  addCommandListener: null,
  isDispatchModalOpen: false,
  dispatchModalInitialAction: "",
  openDispatchModal: null,
  closeDispatchModal: null,
  isSubscriptionModalOpen: false,
  openSubscriptionModal: null,
  closeSubscriptionModal: null,
})

const Provider: FunctionComponent<Props> = ({
  commands,
  sendCommand,
  clearCommands,
  addCommandListener,
  children,
}) => {
  const {
    isDispatchModalOpen,
    dispatchModalInitialAction,
    openDispatchModal,
    closeDispatchModal,
    isSubscriptionModalOpen,
    openSubscriptionModal,
    closeSubscriptionModal,
  } = useReactotron()

  return (
    <ReactotronContext.Provider
      value={{
        commands,
        sendCommand,
        clearCommands,
        addCommandListener,
        isDispatchModalOpen,
        dispatchModalInitialAction,
        openDispatchModal,
        closeDispatchModal,
        isSubscriptionModalOpen,
        openSubscriptionModal,
        closeSubscriptionModal,
      }}
    >
      {children}
    </ReactotronContext.Provider>
  )
}

export default ReactotronContext
export const ReactotronProvider = Provider
