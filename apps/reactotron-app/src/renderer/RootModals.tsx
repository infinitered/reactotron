import React, { useContext } from "react"
import {
  DispatchActionModal,
  SubscriptionAddModal,
  ReactotronContext,
  StateContext,
} from "reactotron-core-ui"
import { platform as osPlatform } from '@tauri-apps/plugin-os';

const platform = window?.process?.platform || osPlatform();
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
        isDarwin={["darwin", "macos"].includes(platform)}
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
