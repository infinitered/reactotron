import React, { FunctionComponent } from "react"

import useOverlay from "./useOverlay"

import type { OverlayParams } from "./useOverlay"

interface Context {
  overlayParams: OverlayParams
  updateOverlayParams: (params: OverlayParams) => void
}

const ReactNativeContext = React.createContext<Context>({
  overlayParams: {},
  updateOverlayParams: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  const { overlayParams, updateOverlayParams } = useOverlay()

  return (
    <ReactNativeContext.Provider
      value={{
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
