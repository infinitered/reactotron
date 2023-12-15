import React, { useContext } from "react"
import {
  DispatchActionModal,
  SubscriptionAddModal,
  ReactotronContext,
  StateContext,
  DiagnosticModal,
} from "reactotron-core-ui"
import configStore from "./config"
import StandaloneContext from "./contexts/Standalone"
import { getServerStatusData } from "./components/SideBar/Sidebar"

function RootModals() {
  const {
    sendCommand,

    // Dispatch Modal
    isDispatchModalOpen,
    dispatchModalInitialAction,
    closeDispatchModal,
    // Subscription Modal
    isSubscriptionModalOpen,
    closeSubscriptionModal,
    // Diagnostic Modal
    isDiagnosticModalOpen,
    closeDiagnosticModal,
  } = useContext(ReactotronContext)
  const { addSubscription } = useContext(StateContext)
  const { serverStatus } = useContext(StandaloneContext)
  const { serverStatusText } = getServerStatusData(serverStatus)


  const dispatchAction = (action: any) => {
    sendCommand("state.action.dispatch", { action })
  }

  return (
    <>
      <DispatchActionModal
        isOpen={isDispatchModalOpen}
        initialValue={dispatchModalInitialAction}
        onClose={() => {
          closeDispatchModal()
        }}
        onDispatchAction={dispatchAction}
        isDarwin={window.process.platform === "darwin"}
      />
      <SubscriptionAddModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => {
          closeSubscriptionModal()
        }}
        onAddSubscription={(path: string) => {
          // TODO: Get this out of here.
          closeSubscriptionModal()
          addSubscription(path)
        }}
      />
      <DiagnosticModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => {
          closeDiagnosticModal()
        }}
        port={configStore.get("serverPort") as string}
        serverStatusText={serverStatusText}
        onRefresh={() => {
          window.location.reload()
        }}
      />
    </>
  )
}

export default RootModals
