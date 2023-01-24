import React, { FunctionComponent } from "react"

import useStorybook from "./useStorybook"

interface Context {
  isStorybookOn: boolean
  turnOnStorybook: () => void
  turnOffStorybook: () => void
}

const ReactNativeContext = React.createContext<Context>({
  isStorybookOn: false,
  turnOnStorybook: null,
  turnOffStorybook: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  const { isStorybookOn, turnOnStorybook, turnOffStorybook } = useStorybook()

  return (
    <ReactNativeContext.Provider
      value={{
        isStorybookOn,
        turnOnStorybook,
        turnOffStorybook,
      }}
    >
      {children}
    </ReactNativeContext.Provider>
  )
}

export default ReactNativeContext
export const ReactNativeProvider = Provider
