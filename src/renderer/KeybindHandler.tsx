import React, { useContext } from "react"
import { GlobalHotKeys, KeyEventName } from "react-hotkeys"
import ReactotronContext from "./contexts/Reactotron"

const keyMap = {
  // Tab Navigation
  OpenHomeTab: {
    name: "home tab",
    group: "Navigation",
    sequences: ["command+1", "ctrl+1"],
    action: "keyup" as KeyEventName,
  },
  OpenTimelineTab: {
    name: "timeline tab",
    group: "Navigation",
    sequences: ["command+2", "ctrl+2"],
    action: "keyup" as KeyEventName,
  },

  // Modals
  OpenDispatchModal: {
    name: "Open Dispatch Modal",
    group: "State",
    sequences: ["command+d", "ctrl+d"],
    action: "keyup" as KeyEventName,
  },
}

function KeybindHandler({ children }) {
  const { openDispatchModal } = useContext(ReactotronContext)

  const handlers = {
    // Tab Navigation
    OpenHomeTab: () => {
      window.location.hash = "/home"
    },
    OpenTimelineTab: () => {
      window.location.hash = "/"
    },

    // Modals
    OpenDispatchModal: () => {
      openDispatchModal("")
    },
  }

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
      {children}
    </GlobalHotKeys>
  )
}

export default KeybindHandler
