import * as React from "react"
import ReactGA from "react-ga4"
import packageJson from "../../../package.json"

const GA4_KEY = "G-WZE3E5XCQ7"

type UaEventOptions = {
  action: string
  category: string
  label?: string
  value?: number
  nonInteraction?: boolean
  transport?: "beacon" | "xhr" | "image"
}

export const useAnalytics = () => {
  const initialize = React.useCallback(() => {
    ReactGA.initialize(GA4_KEY)
    ReactGA.set({
      app_version: packageJson.version,
      app_platform: process.platform,
      app_arch: process.arch,
    })
  }, [])

  const sendEvent = React.useCallback(
    (event: UaEventOptions) => {
      initialize()
      ReactGA.event(event)
    },
    [initialize]
  )

  const sendKeyboardShortcut = React.useCallback(
    (label: string) => {
      initialize()
      ReactGA.event({
        category: "navigation",
        action: "keyboard_shortcut",
        nonInteraction: false,
        label,
      })
    },
    [initialize]
  )

  const sendPageView = React.useCallback(
    (page: string, title: string) => {
      initialize()
      ReactGA.send({ hitType: "pageview", page, title })
    },
    [initialize]
  )

  return {
    sendEvent,
    sendPageView,
    sendKeyboardShortcut,
  }
}
