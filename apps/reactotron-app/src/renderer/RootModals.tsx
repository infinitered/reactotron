import React, { useContext } from "react"
import {
  DispatchActionModal,
  SubscriptionAddModal,
  ReactotronContext,
  StateContext,
} from "reactotron-core-ui"
import StandaloneContext from "./contexts/Standalone"
import McpSettingsModal from "./components/McpSettingsModal"

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
  } = useContext(ReactotronContext)
  const { addSubscription } = useContext(StateContext)
  const { mcpSettingsOpen, closeMcpSettings, mcpRedactionConfig, updateMcpRedactionConfig } =
    useContext(StandaloneContext)

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
      <McpSettingsModal
        isOpen={mcpSettingsOpen}
        onClose={closeMcpSettings}
        config={mcpRedactionConfig}
        onUpdate={updateMcpRedactionConfig}
      />
    </>
  )
}

export default RootModals
