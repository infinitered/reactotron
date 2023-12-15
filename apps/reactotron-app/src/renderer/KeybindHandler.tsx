import React, { useContext } from "react"
import { GlobalHotKeys, type KeyMap } from "react-hotkeys"
import { ReactotronContext, StateContext } from "reactotron-core-ui"
import LayoutContext from "./contexts/Layout"

const keyMap = {
  // Application wide
  ToggleSidebar: {
    name: "Toggle Sidebar",
    group: "Application",
    sequences: ["command+shift+s", "ctrl+shift+s"],
    action: "keyup",
  },
  // Tab Navigation
  OpenHomeTab: {
    name: "Home tab",
    group: "Navigation",
    sequences: ["command+1", "ctrl+1"],
    action: "keyup",
  },
  OpenTimelineTab: {
    name: "Timeline tab",
    group: "Navigation",
    sequences: ["command+2", "ctrl+2"],
    action: "keyup",
  },
  OpenStateTab: {
    name: "State tab",
    group: "Navigation",
    sequences: ["command+3", "ctrl+3"],
    action: "keyup",
  },
  OpenReactNativeTab: {
    name: "React Native tab",
    group: "Navigation",
    sequences: ["command+4", "ctrl+4"],
    action: "keyup",
  },
  OpenCustomCommandsTab: {
    name: "Custom Commands tab",
    group: "Navigation",
    sequences: ["command+5", "ctrl+5"],
    action: "keyup",
  },
  OpenPreferencesTab: {
    name: "Preferences tab",
    group: "Navigation",
    sequences: ["command+,", "ctrl+,"],
    action: "keyup",
  },
  OpenHelpTab: {
    name: "Help tab",
    group: "Navigation",
    sequences: ["command+?", "ctrl+?"],
    action: "keyup",
  },
  // Timeline
  ClearTimeline: {
    name: "Clear Timeline",
    group: "Timeline",
    sequences: ["command+k", "ctrl+k"],
    action: "keyup",
  },
  // Modals
  // TODO: What keybinding should this be set to?
  // OpenFindKeysValuesModal: {
  //   name: "Find keys or values",
  //   group: "State",
  //   sequences: ["command+k", "ctrl+k"],
  //   action: "keyup" ,
  // },
  OpenSubscriptionModal: {
    name: "Open Subscription modal",
    group: "State",
    sequences: ["command+n", "ctrl+n"],
    action: "keyup",
  },
  OpenDispatchModal: {
    name: "Open Dispatch modal",
    group: "State",
    sequences: ["command+d", "ctrl+d"],
    action: "keyup",
  },
  TakeSnapshot: {
    name: "Take snapshot",
    group: "State",
    sequences: ["command+s", "ctrl+s"],
    action: "keyup",
  },
} satisfies KeyMap

type ActionName = keyof typeof keyMap

function KeybindHandler({ children }) {
  const { toggleSideBar } = useContext(LayoutContext)
  const { openDispatchModal, openSubscriptionModal, clearCommands } = useContext(ReactotronContext)
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
    OpenPreferencesTab: () => {
      window.location.hash = "/preferences"
    },
    OpenHelpTab: () => {
      window.location.hash = "/help"
    },

    // Modals
    // OpenFindKeysValuesModal: () => {
    //   throw new Error("Implement Me!")
    // },
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
    ClearTimeline: () => {
      clearCommands()
    },
  } satisfies Record<ActionName, (keyEvent: KeyboardEvent) => void>

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
      {children}
    </GlobalHotKeys>
  )
}

export default KeybindHandler
