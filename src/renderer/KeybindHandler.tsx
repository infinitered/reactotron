import React, { useContext } from "react"
import { GlobalHotKeys, KeyEventName } from "react-hotkeys"
import { ReactotronContext, StateContext } from "reactotron-core-ui"

import StandaloneContext from "./contexts/Standalone"

const keyMap = {
  // Tab Navigation
  OpenHomeTab: {
    name: "Home tab",
    group: "Navigation",
    sequences: ["command+1", "ctrl+1"],
    action: "keyup" as KeyEventName,
  },
  OpenTimelineTab: {
    name: "Timeline tab",
    group: "Navigation",
    sequences: ["command+2", "ctrl+2"],
    action: "keyup" as KeyEventName,
  },
  OpenStateTab: {
    name: "State tab",
    group: "Navigation",
    sequences: ["command+3", "ctrl+3"],
    action: "keyup" as KeyEventName,
  },
  OpenReactNativeTab: {
    name: "React Native tab",
    group: "Navigation",
    sequences: ["command+4", "ctrl+4"],
    action: "keyup" as KeyEventName,
  },
  OpenCustomCommandsTab: {
    name: "Custom Commands tab",
    group: "Navigation",
    sequences: ["command+5", "ctrl+5"],
    action: "keyup" as KeyEventName,
  },
  OpenHelpTab: {
    name: "Help tab",
    group: "Navigation",
    sequences: ["command+?", "ctrl+?"],
    action: "keyup" as KeyEventName,
  },

  // Modals
  OpenFindKeysValuesModal: {
    name: "Find keys or values",
    group: "State",
    sequences: ["command+k", "ctrl+k"],
    action: "keyup" as KeyEventName,
  },
  OpenSubscriptionModal: {
    name: "Open Subscription modal",
    group: "State",
    sequences: ["command+n", "ctrl+n"],
    action: "keyup" as KeyEventName,
  },
  OpenDispatchModal: {
    name: "Open Dispatch modal",
    group: "State",
    sequences: ["command+d", "ctrl+d"],
    action: "keyup" as KeyEventName,
  },
  TakeSnapshot: {
    name: "Take snapshot",
    group: "State",
    sequences: ["command+s", "ctrl+s"],
    action: "keyup" as KeyEventName,
  },

  // Miscellaneous
  ToggleSidebar: {
    name: "Toggle Sidebar",
    group: "State",
    sequences: ["command+shift+s", "ctrl+shift+s"],
    action: "keyup" as KeyEventName,
  },
}

function KeybindHandler({ children }) {
  const { toggleSideBar } = useContext(StandaloneContext)
  const { openDispatchModal, openSubscriptionModal } = useContext(ReactotronContext)
  const { createSnapshot } = useContext(StateContext)

  const handlers = {
    // Tab Navigation
    OpenHomeTab: () => {
      window.location.hash = "/home"
    },
    OpenTimelineTab: () => {
      window.location.hash = "/"
    },
    OpenStateTab: () => {
      window.location.hash = "/state/subscriptions"
    },
    OpenReactNativeTab: () => {
      window.location.hash = "/native/overlay"
    },
    OpenCustomCommandsTab: () => {
      window.location.hash = "/customCommands"
    },
    OpenHelpTab: () => {
      window.location.hash = "/help"
    },

    // Modals
    OpenFindKeysValuesModal: () => {
      throw new Error("Implement Me!")
    },
    OpenSubscriptionModal: () => {
      openSubscriptionModal()
    },
    OpenDispatchModal: () => {
      openDispatchModal("")
    },
    TakeSnapshot: () => {
      createSnapshot()
    },

    // Miscellaneous
    ToggleSidebar: () => {
      toggleSideBar()
    },
  }

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
      {children}
    </GlobalHotKeys>
  )
}

export default KeybindHandler
