import React, { useCallback, useEffect, useState } from "react"
import ReactGA from "react-ga4"
import packageJson from "../../../package.json"
import { useLocation } from "react-router"
import configStore from "../config"
import { confirmAlert } from "react-confirm-alert" // Import
import { reactotronAnalytics } from "../images"
import "react-confirm-alert/src/react-confirm-alert.css" // Import css

// This is the Google Analytics 4 key for Reactotron
// TODO: Change this to the correct key for production.
const GA4_KEY = "G-WZE3E5XCQ7"

// I had trouble importing this type from the react-ga4 package, so I'm defining it here.
type UaEventOptions = {
  action: string
  category: string
  label?: string
  value?: number
  nonInteraction?: boolean
  transport?: "beacon" | "xhr" | "image"
}

// Our user's opt-out status can be one of these three values.
// Analytics will never be initialized if the user has opted out or if the status is unknown.
type IOptOutStatus = "unknown" | "true" | "false"

// This is the main analytics hook that we use throughout the app.
// It handles initializing analytics, sending events, and tracking page views.
// It also handles the user's opt-out status.
// We use a custom alert to ask the user if they want to opt-in to analytics.
export const useAnalytics = () => {
  const [initialized, setInitialized] = useState(false)
  const [optedOut, setOptedOut] = useState<IOptOutStatus>("unknown")

  useEffect(() => {
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
    const status = configStore.get("analyticsOptOut")

    if (status === "unknown") {
      console.log(`[analytics] user has not opted in or out`)
      confirmAlert({
        closeOnEscape: false,
        closeOnClickOutside: false,
        customUI: CustomAlert,
      })
    } else {
      // If the user has opted out, we'll disable analytics
      setOptedOut(status as IOptOutStatus)
      setInitialized(false)
      console.log(`[analytics] user has opted ${status === "true" ? "out" : "in"}`)
    }
  }

  // Initialize analytics and set some system data like the app version and platform
  // as well as the mode we are running in. We don't want to send analytics events
  // during tests, so we disable them if we are running in test mode.
  // We also disable analytics if the user has opted out.
  useEffect(() => {
    const initialize = () => {
      const testMode = process.env.NODE_ENV === "test" // we don't want to send analytics events during tests
      ReactGA.initialize(GA4_KEY, { testMode: testMode || optedOut === "true" })
      optedOut === "false" &&
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
  const sendAnalyticsEvent = useCallback(
    (event: UaEventOptions) => {
      if (optedOut === "true") {
        // console.log("[analytics] Disabled. Not sending event")
        return
      }
      console.log("[analytics] Sending event", event)
      ReactGA.event(event)
    },
    [optedOut]
  )

  // Send a page view event
  const sendPageViewAnalyticsEvent = useCallback(
    (page: string) => {
      if (optedOut === "true") {
        // console.log("[analytics] Disabled. Not sending page view event")
        return
      }
      console.log("[analytics] Sending page view event", page)
      ReactGA.send({ hitType: "pageview", page })
    },
    [optedOut]
  )

  // Send a keyboard shortcut event
  const sendKeyboardShortcutAnalyticsEvent = useCallback(
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
  const sendCustomCommandAnalyticsEvent = useCallback(
    (command: string, title: string) => {
      sendAnalyticsEvent({
        category: "custom_command",
        action: command,
        nonInteraction: false,
        label: title,
      })
    },
    [sendAnalyticsEvent]
  )

  // Send an external link event
  const sendExternalLinkAnalyticsEvent = useCallback(
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

  return {
    initializeAnalytics,
    sendAnalyticsEvent,
    sendPageViewAnalyticsEvent,
    sendKeyboardShortcutAnalyticsEvent,
    sendCustomCommandAnalyticsEvent,
    sendExternalLinkAnalyticsEvent,
  }
}

// This hook is used to track page views within the app automatically using react-router-dom
// This hook should only be used one time in the app, near the root of the component tree
// but inside the HashRouter.
export const usePageTracking = () => {
  const location = useLocation()
  const { sendPageViewAnalyticsEvent } = useAnalytics()

  useEffect(() => {
    sendPageViewAnalyticsEvent(location.pathname)
  }, [location, sendPageViewAnalyticsEvent])
}

// This is a custom alert that we use to ask the user if they want to opt-in to analytics
// We use this instead of the default alert because we want to style it to match our app.
// We inherit the styles from react-confirm-alert and override them as needed.
// Unfortunately, we can't use styled-components here because react-confirm-alert doesn't support it.
// This also means we have to hard-code the colors here instead of using our theme, which is not ideal.
const CustomAlert = ({ onClose }) => {
  return (
    <div
      className="react-confirm-alert-overlay"
      style={{
        background: "#1e1e1e",
      }}
    >
      <div
        className="react-confirm-alert-body"
        style={{
          background: "#1e1e1e",
          color: "#c3c3c3",
          boxShadow: "0 20px 75px rgba(255, 255, 255, 0.13)",
          width: "80%",
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <img
            src={reactotronAnalytics}
            style={{
              height: 128,
            }}
          />
        </div>
        <h1>Opt in to Reactotron analytics?</h1>
        <p>Help us improve Reactotron!</p>
        <p>
          We&apos;d like to collect anonymous usage data to enhance Reactotron&apos;s performance
          and features. This data includes general usage patterns and interactions. No personal
          information will be collected.
        </p>
        <p>
          You can change this setting at any time and by opting in, you can contribute to making
          Reactotron better for everyone!
        </p>
        <p>Would you like to participate?</p>
        <div
          className="react-confirm-alert-button-group"
          style={{
            flexDirection: "column",
          }}
        >
          <button
            onClick={() => {
              configStore.set("analyticsOptOut", "true")
              onClose()
            }}
            style={{
              fontSize: 16,
              backgroundColor: "#cf6a4c",
              color: "#1e1e1e",
            }}
          >
            No, don&apos;t collect any data
          </button>
          <button
            onClick={() => {
              configStore.set("analyticsOptOut", "false")
              onClose()
            }}
            style={{
              fontSize: 16,
              marginTop: 20,
              backgroundColor: "#8f9d6a",
              color: "#1e1e1e",
              fontWeight: "bold",
            }}
          >
            Yes, I understand no personal information will be collected
          </button>
        </div>
      </div>
    </div>
  )
}
