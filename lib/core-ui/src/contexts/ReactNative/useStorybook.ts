import { useState, useCallback, useContext, useEffect, useRef } from "react"

import ReactotronContext from "../Reactotron"
import { CommandType } from "../../types"

function useStorybook() {
  const { sendCommand, addCommandListener } = useContext(ReactotronContext)
  const [isStorybookOn, setIsStorybookOn] = useState(false)

  // We use these refs to avoid executing the following useEffect over and over adding a bunch of listeners but allow it to have updated info.
  // I would like to see if there is a more "correct" approach eventually but this works for now.
  const isStorybookOnRef = useRef(isStorybookOn)
  isStorybookOnRef.current = isStorybookOn

  const sendCommandRef = useRef(sendCommand)
  sendCommandRef.current = sendCommand

  useEffect(() => {
    addCommandListener(command => {
      // TODO: Switch to a connection event if/when that is available
      if (command.type !== CommandType.ClientIntro) return

      sendCommandRef.current("storybook", isStorybookOnRef.current, command.clientId)
    })
  }, [addCommandListener, isStorybookOnRef, sendCommandRef])
  // End of this ref madness

  const turnOnStorybook = useCallback(() => {
    setIsStorybookOn(true)
    sendCommand("storybook", true)
  }, [sendCommand])

  const turnOffStorybook = useCallback(() => {
    setIsStorybookOn(false)
    sendCommand("storybook", false)
  }, [sendCommand])

  return { isStorybookOn, turnOnStorybook, turnOffStorybook }
}

export default useStorybook
