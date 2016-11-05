// figure out the platform
const platform = window.process.platform

const isWindows = platform === 'win32'
const isMac = platform === 'darwin'
const isLinux = platform === 'linux'

export default {
  mousetrap: isMac ? 'command' : 'ctrl',
  modifierName: isMac ? '⌘' : 'CTRL'
}

