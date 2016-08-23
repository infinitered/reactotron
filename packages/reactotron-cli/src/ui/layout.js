import blessed from 'blessed'

const screen = blessed.screen({
  smartCSR: true,
  title: 'reactotron',
  dockBorders: false,
  fullUnicode: true
})

const promptBox = blessed.prompt({
  parent: screen,
  top: 'center',
  left: 'center',
  height: 'shrink',
  width: 'shrink',
  border: 'line',
  label: ' {blue-fg}Prompt{/} ',
  tags: true,
  keys: true,
  mouse: true,
  hidden: true
})

const messageBox = blessed.message({
  parent: screen,
  top: 'center',
  left: 'center',
  height: 'shrink',
  width: 'shrink',
  border: 'line',
  label: ' {blue-fg}Message{/} ',
  tags: true,
  keys: true,
  mouse: true,
  hidden: true
})

const infoBox = blessed.message({
  parent: screen,
  top: 'center',
  left: 'center',
  height: 'shrink',
  width: '40%',
  border: 'line',
  label: ' {blue-fg}Info{/} ',
  tags: true,
  keys: true,
  mouse: true,
  hidden: true,
  style: {
    bg: '#023f00',
    border: {
      fg: '#f0f0f0'
    }
  }
})

const logBox = blessed.log({
  parent: screen,
  scrollable: true,
  left: 0,
  top: 0,
  width: '33%',
  height: '100%-1',
  border: 'line',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  scrollback: 400,
  label: ' {white-fg} Log {/} ',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
})

const stateContainer = blessed.box({
  parent: screen,
  left: 'center',
  width: '33%',
  top: 0,
  height: '100%-1'
})

const stateActionBox = blessed.log({
  parent: stateContainer,
  scrollable: true,
  left: '0',
  top: 0,
  height: '50%',
  width: '100%',
  border: 'line',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  label: ' {white-fg}State Actions{/} ',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
})

const stateWatchBox = blessed.log({
  parent: stateContainer,
  scrollable: true,
  left: 0,
  width: '100%',
  bottom: 0,
  height: '50%',
  border: 'line',
  tags: true,
  keys: false,
  vi: false,
  mouse: true,
  label: ' {white-fg}State Subscriptions{/}',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
})

const rightContainer = blessed.box({
  parent: screen,
  right: 0,
  top: 0,
  height: '100%-1',
  width: '33%'
})

const apiBox = blessed.log({
  parent: rightContainer,
  scrollable: true,
  border: 'line',
  height: '75%',
  width: '100%',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  scrollback: 400,
  label: ' {white-fg}Api{/} ',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
})

const benchBox = blessed.log({
  parent: rightContainer,
  scrollable: true,
  border: 'line',
  height: '25%',
  bottom: 0,
  width: '100%',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  scrollback: 400,
  label: ' {white-fg}Benchmark{/} ',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
})

const statusBox = blessed.box({
  parent: screen,
  bottom: 0,
  height: 1,
  left: 0,
  right: 0,
  width: '100%',
  tags: true
})

const instructionsBox = blessed.box({
  parent: statusBox,
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  tags: true
})

const brandingBox = blessed.box({
  parent: statusBox,
  width: 'shrink',
  height: '100%',
  left: 0,
  top: 0,
  tags: true,
  content: ''
})

const connectionBox = blessed.box({
  parent: statusBox,
  top: 0,
  right: 0,
  height: '100%',
  width: 'shrink',
  content: '',
  tags: true
})

export default () => ({
  screen,
  connectionBox,
  promptBox,
  messageBox,
  infoBox,
  logBox,
  stateActionBox,
  stateWatchBox,
  apiBox,
  benchBox,
  instructionsBox,
  statusBox,
  brandingBox
})
