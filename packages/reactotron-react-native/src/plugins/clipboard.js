import { Clipboard } from 'react-native'

export default (pluginConfig = {}) => reactotron => {
  /**
   * Send the contents of the app's clipboard back to reactotron.
   */
  function readClipboard () {
    Clipboard.getString().then(value => {
      reactotron.send('clipboard.value', { value })
    })
  }

  /**
   * Writes to the device's clipboard.
   *
   * @param command The reactotron command.
   */
  function writeClipboard (command) {
    const value = command.payload && command.payload.value
    if (typeof value === 'string') {
      Clipboard.setString(value)
    }
  }

  return {
    onCommand: command => {
      if (command.type === 'clipboard.read') readClipboard()
      if (command.type === 'clipboard.write') writeClipboard(command)
    }
  }
}
