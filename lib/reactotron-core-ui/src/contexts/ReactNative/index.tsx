import React, { FunctionComponent } from "react"

import useOverlay from "./useOverlay"
import useStorybook from "./useStorybook"

import type { OverlayParams } from "./useOverlay"

interface Context {
  isStorybookOn: boolean
  turnOnStorybook: () => void
  turnOffStorybook: () => void
  overlayParams: OverlayParams
  updateOverlayParams: (params: OverlayParams) => void
}

const ReactNativeContext = React.createContext<Context>({
  isStorybookOn: false,
  turnOnStorybook: null,
  turnOffStorybook: null,
  overlayParams: {},
  updateOverlayParams: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  const { isStorybookOn, turnOnStorybook, turnOffStorybook } = useStorybook()
  const { overlayParams, updateOverlayParams } = useOverlay()

  return (
    <ReactNativeContext.Provider
      value={{
        isStorybookOn,
        turnOnStorybook,
        turnOffStorybook,
        overlayParams,
        updateOverlayParams,
      }}
    >
      {children}
    </ReactNativeContext.Provider>
  )
}

export default ReactNativeContext
export const ReactNativeProvider = Provider
