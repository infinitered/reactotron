import React, { useContext } from "react"
import {
  DispatchActionModal,
  SubscriptionAddModal,
  ReactotronContext,
  StateContext,
} from "reactotron-core-ui"
import { useAnalytics } from "./util/analyticsHelpers"

function RootModals() {
  const { sendAnalyticsEvent } = useAnalytics()
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

  return (
    <>
      <DispatchActionModal
        isOpen={isDispatchModalOpen}
        initialValue={dispatchModalInitialAction}
        onClose={() => {
          closeDispatchModal()
          sendAnalyticsEvent({
            category: "dispatch",
            action: "dispatchAbort",
          })
        }}
        onDispatchAction={(action: any) => {
          sendCommand("state.action.dispatch", { action })
          sendAnalyticsEvent({
            category: "dispatch",
            action: "dispatchConfirm",
          })
        }}
        isDarwin={window.process.platform === "darwin"}
      />
      <SubscriptionAddModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => {
          closeSubscriptionModal()
          sendAnalyticsEvent({
            category: "subscription",
            action: "addAbort",
          })
        }}
        onAddSubscription={(path: string) => {
          // TODO: Get this out of here.
          closeSubscriptionModal()
          addSubscription(path)
          sendAnalyticsEvent({
            category: "subscription",
            action: "addConfirm",
          })
        }}
      />
    </>
  )
}

export default RootModals
