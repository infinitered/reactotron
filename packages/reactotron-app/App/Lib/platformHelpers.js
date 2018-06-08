import IconPhoneDefault from "react-icons/lib/fa/question"
import IconPhoneApple from "react-icons/lib/fa/apple"
import IconPhoneAndroid from "react-icons/lib/fa/android"

export function getPlatformName(connection) {
  switch (connection.platform) {
    case "ios":
      return "iOS"
    case "android":
      return "Android"
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
      return `${osRelease} (sdk ${platformVersion})`
    }

    default:
      return ""
  }
}

export function getScreen(connection) {
  const { screenWidth, screenHeight, screenScale } = connection

  if (screenWidth && screenHeight && screenScale) {
    return `${screenWidth} x ${screenHeight}`
  }
}

const PHONE_ICONS = {
  ios: IconPhoneApple,
  android: IconPhoneAndroid,
}

export function getIcon(connection) {
    return PHONE_ICONS[connection.platform] || IconPhoneDefault
}
