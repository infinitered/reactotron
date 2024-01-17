import { useCallback, useEffect, useState } from "react"
import ReactGA from "react-ga4"
import packageJson from "../../../package.json"
import { useLocation } from "react-router-dom"

const GA4_KEY = "G-WZE3E5XCQ7"

type UaEventOptions = {
  action: string
  category: string
  label?: string
  value?: number
  nonInteraction?: boolean
  transport?: "beacon" | "xhr" | "image"
}
const isDevelopment = process.env.NODE_ENV !== "production"

export const useAnalytics = () => {
  const [initialized, setInitialized] = useState(false)
  // const [optedOut, setOptedOut] = useState(false) // Setting this to true will disable analytics
  const [optedOut, setOptedOut] = useState(isDevelopment)

  useEffect(() => {
    const initialize = () => {
      const testMode = process.env.NODE_ENV === "test" // we don't want to send analytics events during tests
      ReactGA.initialize(GA4_KEY, {testMode: testMode || optedOut})
      ReactGA.set({
        app_version: packageJson.version,
        app_platform: process.platform,
        app_arch: process.arch,
      })
    }
    
    if (!initialized) {
      initialize()
      setInitialized(true)
    }
  }, [initialized, optedOut])

  const sendAnalyticsEvent = useCallback(
    (event: UaEventOptions) => {
      console.log("Sending analytics event", event)
      ReactGA.event(event)
    },
    []
  )

  const sendPageViewAnalyticsEvent = useCallback(
    (page: string, title: string) => {
      console.log("Sending page view analytics event", {page, title})
      ReactGA.send({ hitType: "pageview", page, title })
    },
    []
  )

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

  return {
    sendAnalyticsEvent,
    sendPageViewAnalyticsEvent,
    sendKeyboardShortcutAnalyticsEvent,
    sendCustomCommandAnalyticsEvent,
  }
}

// This hook is used to track page views within the app automatically using react-router-dom
export const usePageTracking = () => {
  const location = useLocation()
  const { sendPageViewAnalyticsEvent } = useAnalytics()

  useEffect(() => {
    sendPageViewAnalyticsEvent(location.pathname, location.key)
  }, [location, sendPageViewAnalyticsEvent])
}
