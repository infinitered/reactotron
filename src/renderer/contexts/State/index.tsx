import React, { FunctionComponent, useContext } from "react"

import StandaloneContext from "../Standalone"

import useSubscriptions from "./useSubscriptions"
import useSnapshots, { Snapshot } from "./useSnapshots"

interface Context {
  subscriptions: string[]
  addSubscription: (path: string) => void
  removeSubscription: (path: string) => void
  clearSubscriptions: () => void
  snapshots: Snapshot[]
  createSnapshot: () => void
  restoreSnapshot: (snapshot: Snapshot) => void
  removeSnapshot: (snapshot: Snapshot) => void
}

const StateContext = React.createContext<Context>({
  subscriptions: [],
  addSubscription: null,
  removeSubscription: null,
  clearSubscriptions: null,
  snapshots: [],
  createSnapshot: null,
  restoreSnapshot: null,
  removeSnapshot: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  // TODO: Get this to not use standalone...
  const { sendCommand } = useContext(StandaloneContext)

  const {
    subscriptions,
    addSubscription,
    removeSubscription,
    clearSubscriptions,
  } = useSubscriptions(sendCommand)

  const { snapshots, createSnapshot, restoreSnapshot, removeSnapshot } = useSnapshots()

  return (
    <StateContext.Provider
      value={{
        subscriptions,
        addSubscription,
        removeSubscription,
        clearSubscriptions,
        snapshots,
        createSnapshot,
        restoreSnapshot,
        removeSnapshot,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export default StateContext
export const StateProvider = Provider
