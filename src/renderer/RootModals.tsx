import React, { useContext } from "react"
import { DispatchActionModal } from "reactotron-core-ui"

import ReactotronContext from "./contexts/Reactotron"
import StandaloneContext from "./contexts/Standalone"

function RootModals() {
  const { isDispatchModalOpen, dispatchModalInitialAction, closeDispatchModal } = useContext(
    ReactotronContext
  )
  // See about moving this out so we can share this between standalone and flipper
  const { sendCommand } = useContext(StandaloneContext)

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
    </>
  )
}

export default RootModals
