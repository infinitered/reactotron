import { useState, useCallback, useContext, useEffect, useRef } from "react"

import ReactotronContext from "../Reactotron"
import { CommandType } from "../../types"

export interface OverlayParams {
  opacity?: number
  uri?: string
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline"
  width?: number
  height?: number
  growToWindow?: boolean
  resizeMode?: "cover" | "contain" | "stretch" // | "repeat" | "center"
  marginLeft?: number
  marginRight?: number
  marginTop?: number
  marginBottom?: number
  showDebug?: boolean
}

function useOverlay() {
  const { sendCommand, addCommandListener } = useContext(ReactotronContext)
  const [overlayParams, setOverlayParams] = useState<OverlayParams>({})

  // We use these refs to avoid executing the following useEffect over and over adding a bunch of listeners but allow it to have updated info.
  // I would like to see if there is a more "correct" approach eventually but this works for now.
  const overlayParamsRef = useRef(overlayParams)
  overlayParamsRef.current = overlayParams

  const sendCommandRef = useRef(sendCommand)
  sendCommandRef.current = sendCommand

  useEffect(() => {
    addCommandListener((command) => {
      // TODO: Switch to a connection event if/when that is available
      if (command.type !== CommandType.ClientIntro) return

      sendCommandRef.current("overlay", overlayParamsRef.current, command.clientId)
    })
  }, [addCommandListener, overlayParamsRef, sendCommandRef])
  // End of this ref madness

  const updateOverlayParams = useCallback(
    (params: OverlayParams) => {
      const newParams = { ...overlayParams, ...params }
      setOverlayParams(newParams)
      sendCommand("overlay", newParams)
    },
    [sendCommand, overlayParams]
  )

  return { overlayParams, updateOverlayParams }
}

export default useOverlay
