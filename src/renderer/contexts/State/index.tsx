import React, { FunctionComponent, useContext } from "react"

import StandaloneContext from "../Standalone"

import useSubscriptions from "./useSubscriptions"

interface Context {
  subscriptions: string[]
  addSubscription: (path: string) => void
  removeSubscription: (path: string) => void
  clearSubscriptions: () => void
}

const StateContext = React.createContext<Context>({
  subscriptions: [],
  addSubscription: null,
  removeSubscription: null,
  clearSubscriptions: null,
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

  return (
    <StateContext.Provider
      value={{
        subscriptions,
        addSubscription,
        removeSubscription,
        clearSubscriptions,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export default StateContext
export const StateProvider = Provider
