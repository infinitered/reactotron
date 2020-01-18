import React, { useContext } from "react"
import { DispatchActionModal, SubscriptionAddModal } from "reactotron-core-ui"

import ReactotronContext from "./contexts/Reactotron"
import StandaloneContext from "./contexts/Standalone"
import StateContext from "./contexts/State"

function RootModals() {
  const {
    // Dispatch Modal
    isDispatchModalOpen,
    dispatchModalInitialAction,
    closeDispatchModal,
    // Subscription Modal
    isSubscriptionModalOpen,
    closeSubscriptionModal,
  } = useContext(ReactotronContext)
  // See about moving this out so we can share this between standalone and flipper
  const { sendCommand } = useContext(StandaloneContext)
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
