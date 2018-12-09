import IconDefault from "react-icons/lib/fa/question"
import IconPhoneApple from "react-icons/lib/fa/apple"
import IconPhoneAndroid from "react-icons/lib/fa/android"
import IconBrowserFirefox from "react-icons/lib/fa/firefox"
import IconBrowserSafari from "react-icons/lib/fa/safari"
import IconBrowserEdge from "react-icons/lib/fa/edge"
import IconBrowserChrome from "react-icons/lib/fa/chrome"

export function getPlatformName(connection) {
  switch (connection.platform) {
    case "ios":
      return "iOS"
    case "android":
      return "Android"
    case "browser":
      return getBrowserApp(connection) || "Browser"
    default:
      return connection.platform || "Unknown platform"
  }
}

export function getPlatformDetails(connection) {
  const { platformVersion, osRelease, platform } = connection

  switch (platform) {
    case "ios": {
      return `${platformVersion}`
    }

    case "android": {
      if (osRelease) {
        return `${osRelease || ""} (sdk ${platformVersion})`
      } else {
        return `sdk ${platformVersion}`
      }
    }

    case "browser": {
      if (platformVersion === "MacIntel") {
        return "macOS"
      } else {
        return `${platformVersion}`
      }
    }

    default:
      return ""
  }
}

export function getScreen(connection) {
  const { windowWidth, windowHeight, screenScale } = connection

  if (windowWidth && windowHeight && screenScale) {
    return `${windowWidth} x ${windowHeight} @ ${screenScale}x`
  }
}

const PHONE_ICONS = {
  ios: IconPhoneApple,
  android: IconPhoneAndroid,
}
const BROWSER_ICONS = {
  Firefox: IconBrowserFirefox,
  Chrome: IconBrowserChrome,
  Safari: IconBrowserSafari,
  Edge: IconBrowserEdge,
}

const RX_FIREFOX = /Firefox\//
const RX_SAFARI = /Safari\//
const RX_EDGE = /Edge\//
const RX_CHROME = /Chrome\//

export function getBrowserApp(connection) {
  const ua = (connection && connection.userAgent) || ""
  if (RX_FIREFOX.test(ua)) return "Firefox"
  if (RX_CHROME.test(ua)) return "Chrome" // has to go before safari
  if (RX_SAFARI.test(ua)) return "Safari"
  if (RX_EDGE.test(ua)) return "Edge"

  return undefined
}

export function getIcon(connection) {
  if (connection.platform === "browser") {
    const browserApp = getBrowserApp(connection)
    return BROWSER_ICONS[getBrowserApp(connection)] || IconDefault
  } else {
    return PHONE_ICONS[connection.platform] || IconDefault
  }
}
