import R from 'ramda'
import RS from 'ramdasauce'
import SocketIO from 'socket.io'
import blessed from 'blessed'
import Context from './context'
import Router from './router'
import commands from './commands/index'

const screen = blessed.screen({
  smartCSR: true,
  title: 'Replsauce'
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

const connectionBox = blessed.box({
  parent: screen,
  top: 0,
  right: 0,
  height: 1,
  width: 'shrink',
  content: 'Offline',
  tags: true,
  style: {
    bg: 'grey'
  }
})
screen.append(connectionBox)

const logBox = blessed.log({
  parent: screen,
  scrollable: true,
  left: 0,
  bottom: 0,
  width: '50%',
  height: '100%',
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

const PORT = 3334
const io = SocketIO(PORT)

const router = Router.createRouter()
R.forEach((command) => router.register(command), commands)
const context = new Context({
  screen,
  io,
  logBox,
  promptBox,
  router
})

io.on('connection', (socket) => {
  connectionBox.setContent('{green-fg}Online{/}')
  screen.render()
  socket.on('command', (data) => {
    const action = JSON.parse(data)
    context.post(action)
    screen.render()
  })

  socket.on('disconnect', () => {
    connectionBox.setContent('{red-fg}Offline{/}')
    screen.render()
  })
})

screen.key('v', () => context.post({type: 'redux.value.prompt'}))
screen.key('k', () => context.post({type: 'redux.key.prompt'}))
screen.key('d', () => context.post({type: 'redux.dispatch.prompt'}))
screen.key(['C-c', 'q', 'escape'], () => context.post({type: 'die'}))

screen.render()
