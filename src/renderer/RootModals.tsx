import React, { useContext } from "react"
import { DispatchActionModal, SubscriptionAddModal } from "reactotron-core-ui"

import ReactotronContext from "./contexts/Reactotron"
import StateContext from "./contexts/State"

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
    </>
  )
}

export default RootModals
