import React, { FunctionComponent } from "react"

import { Command } from "../../types"

import useReactotron from "./useReactotron"

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
