import React, { useContext, useRef } from "react"
import { GlobalHotKeys, type KeyEventName } from "react-hotkeys"
import { ReactotronContext, StateContext, TimelineContext } from "reactotron-core-ui"
import LayoutContext from "./contexts/Layout"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"

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
  ZoomIn: {
    name: "Zoom In",
    group: "Application",
    sequences: ["command+=", "ctrl+="],
    action: "keyup" as KeyEventName,
  },
  ZoomOut: {
    name: "Zoom Out",
    group: "Application",
    sequences: ["command+-", "ctrl+-"],
    action: "keyup" as KeyEventName,
  },
  ZoomReset: {
    name: "Reset Zoom",
    group: "Application",
    sequences: ["command+0", "ctrl+0"],
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
  
  const currentZoomRef = useRef(1.0)

  const handlers = {
    
    ZoomIn: async () => {
      try {
        const webviewWindow = getCurrentWebviewWindow()
        
        const currentZoom = currentZoomRef.current
        const newZoom = currentZoom + 0.1
        
        await webviewWindow.setZoom(newZoom)
        currentZoomRef.current = newZoom
      } catch (error) {
        console.error('Zoom in failed:', error)
      }
    },
    ZoomOut: async () => {
      try {
        const webviewWindow = getCurrentWebviewWindow()
        const currentZoom = currentZoomRef.current
        const newZoom = Math.max(currentZoom - 0.1, 0.1)
        await webviewWindow.setZoom(newZoom)
        currentZoomRef.current = newZoom
      } catch (error) {
        console.error('Zoom out failed:', error)
      }
    },
    ZoomReset: async () => {
      try {
        const webviewWindow = getCurrentWebviewWindow()
        await webviewWindow.setZoom(1.0)
        currentZoomRef.current = 1.0
      } catch (error) {
        console.error('Zoom reset failed:', error)
      }
    },

    // Tab Navigation
    OpenHomeTab: () => {
      window.location.hash = "/"
    },
    OpenTimelineTab: () => {
      window.location.hash = "/timeline"
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
    },
  }

  return (
    <GlobalHotKeys keyMap={keyMap as any} handlers={handlers} allowChanges>
      {children}
    </GlobalHotKeys>
  )
}

export default KeybindHandler
