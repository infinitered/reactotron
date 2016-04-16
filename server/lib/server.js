import R from 'ramda'
import RS from 'ramdasauce'
import SocketIO from 'socket.io'
import blessed from 'blessed'
import Context from './context'
import Router from './router'
import commands from './commands/index'

const screen = blessed.screen({
  smartCSR: true,
  title: 'react-native-puppeteer'
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
  label: ' {white-fg}Log{/} ',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
})

const reduxBox = blessed.log({
  parent: screen,
  scrollable: true,
  left: 'center',
  top: 0,
  height: '100%-1',
  width: '34%',
  border: 'line',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  scrollback: 400,
  label: ' {white-fg}Redux{/} ',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
})

const apiBox = blessed.log({
  parent: screen,
  scrollable: true,
  right: 0,
  top: 0,
  height: '100%-1',
  width: '33%',
  border: 'line',
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
  parent:statusBox,
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  tags: true,
  content: '{center}{white-fg}ctrl-c{/} = quit | {white-fg}v{/} = redux value | {white-fg}k{/} = redux key | {white-fg}d{/} = redux dispatch{/}'
})

const welcomeBox = blessed.box({
  parent: statusBox,
  width: 'shrink',
  height: '100%',
  left: 0,
  top: 0,
  tags: true,
  content: '{yellow-fg}react-native-puppeteer{/}'
})

const OFFLINE = '{right}{black-bg}{red-fg}Offline{/}{/}{/}'
const ONLINE = '{right}{black-bg}{green-fg}Online{/}{/}{/}'

const connectionBox = blessed.box({
  parent: statusBox,
  top: 0,
  right: 0,
  height: '100%',
  width: 'shrink',
  content: OFFLINE,
  tags: true
})

const PORT = 3334
const io = SocketIO(PORT)

const router = Router.createRouter()
R.forEach((command) => router.register(command), commands)
const context = new Context({
  screen,
  io,
  logBox,
  promptBox,
  router,
  apiBox,
  reduxBox
})

io.on('connection', (socket) => {
  connectionBox.setContent(ONLINE)
  screen.render()
  socket.on('command', (data) => {
    const action = JSON.parse(data)
    context.post(action)
    screen.render()
  })

  socket.on('disconnect', () => {
    connectionBox.setContent(OFFLINE)
    screen.render()
  })
})

screen.key('v', () => context.post({type: 'redux.value.prompt'}))
screen.key('k', () => context.post({type: 'redux.key.prompt'}))
screen.key('d', () => context.post({type: 'redux.dispatch.prompt'}))
screen.key('C-c', () => context.post({type: 'die'}))

screen.render()
