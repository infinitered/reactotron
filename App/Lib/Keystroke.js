// figure out the platform
const platform = window.process.platform

const isMac = platform === 'darwin'
// const isWindows = platform === 'win32'
// const isLinux = platform === 'linux'

export default {
  mousetrap: isMac ? 'command' : 'ctrl',
  modifierName: isMac ? '⌘' : 'CTRL'
}
