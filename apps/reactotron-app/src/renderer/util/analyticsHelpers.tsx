import React from "react"
import ReactGA from "react-ga4"
import packageJson from "../../../package.json"
import { useLocation } from "react-router"
import configStore from "../config"

// This is the Google Analytics 4 key for Reactotron
// TODO: Change this to the correct key for production.
const GA4_KEY = "G-WZE3E5XCQ7"

type IAnalyticsEventCategory =
  | { category: "opt-out"; actions: ["opt-out"] }
  | { category: "android"; actions: ["settings", "reverse-tunnel", "reload-app", "shake-device"] }
  | { category: "navigation"; actions: ["keyboard_shortcut"] }
  | { category: "external_link"; actions: ["click"] }
  | { category: "timeline"; actions: ["search", "filter", "reverse", "clear"] }
  | { category: "error"; actions: ["OverlayDropImage"] }
  | { category: "overlay"; actions: ["OverlayDropImage", "OverlayRemoveImage", "OverlayShowDebug"] }
  | { category: "dispatch"; actions: ["dispatchAbort", "dispatchConfirm"] }
  | { category: "subscription"; actions: ["addAbort", "addConfirm", "add", "clear"] }
  | { category: "snapshot"; actions: ["copy", "restore", "remove", "copy", "add"] }
  | { category: "storybook"; actions: ["ToggleStorybook"] }
  | { category: "custom_command"; actions: ["sendCommand"] }

// I had trouble importing this type from the react-ga4 package, so I'm defining it here.
type UaEventOptions = {
  category: IAnalyticsEventCategory["category"]
  action: IAnalyticsEventCategory["actions"][number]
  label?: string
  value?: number
  nonInteraction?: boolean
  transport?: "beacon" | "xhr" | "image"
}

// Our user's opt-out status can be one of these three values.
// Analytics will never be initialized if the user has opted out or if the status is unknown.
type IOptOutStatus = "unknown" | true | false

// This is the main analytics hook that we use throughout the app.
// It handles initializing analytics, sending events, and tracking page views.
// It also handles the user's opt-out status.
// We use a custom alert to ask the user if they want to opt-in to analytics.
export const useAnalytics = () => {
  const [initialized, setInitialized] = React.useState(false)
  const [optedOut, setOptedOut] = React.useState<IOptOutStatus>("unknown")

  React.useEffect(() => {
    const storeWatcher = configStore.onDidChange("analyticsOptOut", (newValue) => {
      console.log("[analytics] user has changed opt-out status", newValue)
      setOptedOut(newValue as IOptOutStatus)
    })
    return () => {
      storeWatcher().removeAllListeners()
    }
  }, [])

  // Get the user's opt-out status from the config store
  const initializeAnalytics = () => {
    const status = configStore.get("analyticsOptOut") as IOptOutStatus

    if (status === "unknown") {
      console.log(`[analytics] user has not opted in or out`)
    } else {
      // If the user has opted out, we'll disable analytics
      setOptedOut(status)
      setInitialized(false)
      console.log(`[analytics] user has opted ${status ? "out" : "in"}`)
    }

    return status
  }

  // Initialize analytics and set some system data like the app version and platform
  // as well as the mode we are running in. We don't want to send analytics events
  // during tests, so we disable them if we are running in test mode.
  // We also disable analytics if the user has opted out.
  React.useEffect(() => {
    const initialize = () => {
      const testMode = process.env.NODE_ENV === "test" // we don't want to send analytics events during tests
      ReactGA.initialize(GA4_KEY, { testMode: testMode || optedOut === true })
      !optedOut &&
        ReactGA.set({
          app_version: packageJson.version,
          app_platform: process.platform,
          app_arch: process.arch,
          app_mode: process.env.NODE_ENV,
        })
    }

    if (!initialized) {
      initialize()
      setInitialized(true)
    }
  }, [initialized, optedOut])

  // Send an analytics event
  // This is the main function we use to send events throughout the app.
  // See documentation here for how to use react-ga4:
  // https://github.com/codler/react-ga4
  const sendAnalyticsEvent = React.useCallback(
    (event: UaEventOptions) => {
      if (!optedOut) {
        console.log("[analytics] Sending event", event)
        ReactGA.event(event)
      }
    },
    [optedOut]
  )

  // Send a page view event
  const sendPageViewAnalyticsEvent = React.useCallback(
    (page: string) => {
      if (!optedOut) {
        console.log("[analytics] Sending page view event", page)
        ReactGA.send({ hitType: "pageview", page })
      }
    },
    [optedOut]
  )

  // Send a keyboard shortcut event
  const sendKeyboardShortcutAnalyticsEvent = React.useCallback(
    (label: string) => {
      sendAnalyticsEvent({
        category: "navigation",
        action: "keyboard_shortcut",
        nonInteraction: false,
        label,
      })
    },
    [sendAnalyticsEvent]
  )

  // Send a custom command event
  const sendCustomCommandAnalyticsEvent = React.useCallback(
    (command: string) => {
      sendAnalyticsEvent({
        category: "custom_command",
        action: "sendCommand",
        nonInteraction: false,
        label: command,
      })
    },
    [sendAnalyticsEvent]
  )

  // Send an external link event
  const sendExternalLinkAnalyticsEvent = React.useCallback(
    (label: string) => {
      sendAnalyticsEvent({
        category: "external_link",
        action: "click",
        nonInteraction: false,
        label,
      })
    },
    [sendAnalyticsEvent]
  )

  const sendOptOutAnalyticsEvent = React.useCallback(() => {
    const event = {
      category: "opt-out",
      action: "opt-out",
      nonInteraction: false,
    }
    console.log("[analytics] Sending opt-out event", event)
    ReactGA.event(event) // this is the only time we send an event without checking the optedOut status
  }, [])

  return {
    initializeAnalytics,
    sendAnalyticsEvent,
    sendPageViewAnalyticsEvent,
    sendKeyboardShortcutAnalyticsEvent,
    sendCustomCommandAnalyticsEvent,
    sendExternalLinkAnalyticsEvent,
    sendOptOutAnalyticsEvent,
  }
}

// This hook is used to track page views within the app automatically using react-router-dom
// This hook should only be used one time in the app, near the root of the component tree
// but inside the HashRouter.
export const usePageTracking = () => {
  const location = useLocation()
  const { sendPageViewAnalyticsEvent } = useAnalytics()

  React.useEffect(() => {
    sendPageViewAnalyticsEvent(location.pathname)
  }, [location, sendPageViewAnalyticsEvent])
}
