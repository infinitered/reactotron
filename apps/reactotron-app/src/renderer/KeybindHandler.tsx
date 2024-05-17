import React, { useContext } from "react"
import { GlobalHotKeys, KeyEventName } from "react-hotkeys"
import { ReactotronContext, StateContext, TimelineContext } from "reactotron-core-ui"
import LayoutContext from "./contexts/Layout"
import { useAnalytics } from "./util/analyticsHelpers"

const keyMap = {
  // Application wide
  ToggleSidebar: {
    name: "Toggle Sidebar",
    group: "Application",
    sequences: ["command+shift+s", "ctrl+shift+s"],
    action: "keyup" as KeyEventName,
  },
  ToggleSearch: {
    name: "Toggle Timeline Search",
    group: "Application",
    sequences: ["command+shift+l", "ctrl+shift+l"],
    action: "keyup" as KeyEventName,
  },
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
  // Timeline
  ClearTimeline: {
    name: "Clear Timeline",
    group: "Timeline",
    sequences: ["command+k", "ctrl+k"],
    action: "keyup" as KeyEventName,
  },
  // Modals
  // TODO: What keybinding should this be set to?
  // OpenFindKeysValuesModal: {
  //   name: "Find keys or values",
  //   group: "State",
  //   sequences: ["command+k", "ctrl+k"],
  //   action: "keyup" as KeyEventName,
  // },
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
}

function KeybindHandler({ children }) {
  const { toggleSideBar } = useContext(LayoutContext)
  const { openDispatchModal, openSubscriptionModal, clearCommands } = useContext(ReactotronContext)
  const { openSearch, toggleSearch } = useContext(TimelineContext)
  const { createSnapshot } = useContext(StateContext)
  const { sendKeyboardShortcutAnalyticsEvent } = useAnalytics()

  const handlers = {
    // Tab Navigation
    OpenHomeTab: () => {
      window.location.hash = "/"
      sendKeyboardShortcutAnalyticsEvent("OpenHomeTab")
    },
    OpenTimelineTab: () => {
      window.location.hash = "/timeline"
      sendKeyboardShortcutAnalyticsEvent("OpenTimelineTab")
    },
    OpenStateTab: () => {
      window.location.hash = "/state/subscriptions"
      sendKeyboardShortcutAnalyticsEvent("OpenStateTab")
    },
    OpenReactNativeTab: () => {
      window.location.hash = "/native/overlay"
      sendKeyboardShortcutAnalyticsEvent("OpenReactNativeTab")
    },
    OpenCustomCommandsTab: () => {
      window.location.hash = "/customCommands"
      sendKeyboardShortcutAnalyticsEvent("OpenCustomCommandsTab")
    },
    OpenHelpTab: () => {
      window.location.hash = "/help"
      sendKeyboardShortcutAnalyticsEvent("OpenHelpTab")
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
      sendKeyboardShortcutAnalyticsEvent("TakeSnapshot")
    },

    // Miscellaneous
    ToggleSidebar: () => {
      toggleSideBar()
      sendKeyboardShortcutAnalyticsEvent("ToggleSidebar")
    },
    ToggleSearch: () => {
      // If we're on the timeline page, toggle the search, otherwise switch to the timeline tab and open search
      if (window.location.hash === "#/") {
        toggleSearch()
      } else {
        openSearch()
        handlers.OpenTimelineTab()
      }
    },
    ClearTimeline: () => {
      clearCommands()
      sendKeyboardShortcutAnalyticsEvent("ClearTimeline")
    },
  }

  return (
    <GlobalHotKeys keyMap={keyMap as any} handlers={handlers} allowChanges>
      {children}
    </GlobalHotKeys>
  )
}

export default KeybindHandler
