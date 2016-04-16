import R from 'ramda'
import SocketIO from 'socket.io'
import blessed from 'blessed'
import Context from './context'
import Router from './router'
import commands from './commands/index'

const screen = blessed.screen({
  smartCSR: true,
  title: 'Replsauce'
})

const prompt = blessed.prompt({
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

const box = blessed.box({
  parent: screen,
  bottom: 0,
  right: 0,
  height: 1,
  width: 'shrink',
  content: 'Hello {bold}world{/}!',
  tags: true,
  style: {
    bg: 'grey'
  }
})
// screen.append(box)

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

const listReduxKeys = blessed.list({
  parent: logBox,
  align: 'screen',
  mouse: true,
  keys: true,
  hidden: true,
  vi: true,
  width: 'shrink',
  bottom: 4,
  height: 10,
  style: {
    fg: 'blue',
    bg: 'default',
    selected: {
      bg: 'blue',
      fg: 'white'
    }
  },
  items: ['one', 'two', 'three']
})
listReduxKeys.on('select', (item) => {
  const text = item.getText()
  box.setContent(text)
  listReduxKeys.select()
  return router.post({type: 'redux.value.request', path: text})
  listReduxKeys.hide()
  screen.focusPop()
  screen.render()
})

box.key('enter', (ch, key) => {
  box.setContent('{right}Even different {black-fg}content{/}.{/}\n')
  box.setLine(1, 'bar')
  box.insertLine(1, 'foo')
  screen.render()
})

box.key('escape', (ch, key) => {
  box.setContent('no more focus')
  screen.focusPop()
  screen.render()
})

const PORT = 3334
const io = SocketIO(PORT)

const context = Context({
  screen,
  io,
  logBox
})

const router = Router.createRouter(context)
R.forEach((command) => router.register(command), commands)

io.on('connection', (socket) => {
  connectionBox.setContent('{green-fg}Online{/}')
  screen.render()
  socket.on('command', (data) => {
    const action = JSON.parse(data)
    router.post(action)
    screen.render()
  })

  socket.on('disconnect', () => {
    connectionBox.setContent('{red-fg}Offline{/}')
    screen.render()
  })
})

const die = (exitCode = 0) => {
  screen.destroy()
  process.exit(exitCode)
}

const promptEval = () => {
  prompt.input('Object to dispatch to TEMPERATURE_REQUEST', '', (errInput, value) => {
    let params = null
    eval('params = ' + value) // lulz
    router.post({type: 'redux.dispatch', action: {type: 'TEMPERATURE_REQUEST', ...params}})
    screen.render()
  })
}

const commmandSwitch = (input) => {
  switch (input) {
    case 'q': return die()
    case 'w': return router.post({type: 'redux.value.request', path: null})
    case 'e': return router.post({type: 'redux.value.request', path: 'weather'})
    case 'r': return router.post({type: 'redux.value.request', path: 'weather.temperature'})
    case 'k': return router.post({type: 'redux.key.request', path: null})
    case 'p': return promptEval()
    case '1': return router.post({type: 'redux.dispatch', action: {type: 'TEMPERATURE_REQUEST', city: 'Los Angeles'}})
    case '2': return router.post({type: 'redux.dispatch', action: {type: 'TEMPERATURE_REQUEST', city: 'New York'}})
    case '3': return router.post({type: 'redux.dispatch', action: {type: 'TEMPERATURE_REQUEST', city: 'San Francisco'}})
  }
}

screen.key(['C-c', 'q'], (ch, key) => die(0))
screen.key('space', (ch, key) => {
  prompt.setFront()
  screen.render()
  prompt.input('Whats up?', '', (errInput, value) => {
    commmandSwitch(value)
    screen.render()
  })
})
screen.key([''], (ch, key) => console.log('random key', key))
box.focus()
screen.render()
