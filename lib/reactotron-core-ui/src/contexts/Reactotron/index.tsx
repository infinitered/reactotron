import React, { FunctionComponent } from "react"

import type { Command } from "reactotron-core-contract"

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

  // Diagnostic Modal
  isDiagnosticModalOpen: boolean
  openDiagnosticModal: () => void
  closeDiagnosticModal: () => void

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
  isDiagnosticModalOpen: false,
  openDiagnosticModal: null,
  closeDiagnosticModal: null,
})

const Provider: FunctionComponent<React.PropsWithChildren<Props>> = ({
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
    isDiagnosticModalOpen,
    openDiagnosticModal,
    closeDiagnosticModal,
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
        isDiagnosticModalOpen,
        openDiagnosticModal,
        closeDiagnosticModal,
      }}
    >
      {children}
    </ReactotronContext.Provider>
  )
}

export default ReactotronContext
export const ReactotronProvider = Provider
