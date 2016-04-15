import R from 'ramda'
import RS from 'ramdasauce'
import SocketIO from 'socket.io'
import blessed from 'blessed'
import moment from 'moment'

const screen = blessed.screen({
  smartCSR: true
})
screen.title = 'Replsauce'

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
  reduxValues(text)
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

io.on('connection', (socket) => {
  connectionBox.setContent('{green-fg}Online{/}')
  screen.render()
  socket.on('command', (data) => {
    const action = JSON.parse(data)
    const {type, message} = action
    const time = moment().format('HH:mm:ss.SSS')
    if (type === 'log') {
      logBox.log(`{white-fg}${time}{/} - {blue-fg}${type}{/}`)
      logBox.log(message)
      logBox.log('')
    } else if (type === 'redux.keys') {
      listReduxKeys.show()
      listReduxKeys.setItems(message.keys)
      listReduxKeys.focus()
    }
    screen.render()
  })

  socket.on('disconnect', () => {
    connectionBox.setContent('{red-fg}Offline{/}')
    screen.render()
  })
})

const send = (type, payload) => {
  const body = { type, payload }
  const bodyJson = JSON.stringify(body)
  io.sockets.emit('command', bodyJson)
}

const die = (exitCode = 0) => {
  screen.destroy()
  process.exit(exitCode)
}

const reduxValues = (path) => {
  send('redux.store', {path})
}

const reduxKeys = (path) => {
  send('redux.keys', {path})
}

const dispatch = (type, params = {}) => {
  send('redux.dispatch', {action: {type, ...params}})
}

const promptEval = () => {
  prompt.input('Object to dispatch to TEMPERATURE_REQUEST', '', (errInput, value) => {
    let x = null
    eval('x = ' + value)  // lulz
    dispatch('TEMPERATURE_REQUEST', x)
    screen.render()
  })
}

const commmandSwitch = (input) => {
  switch (input) {
    case 'q': return die()
    case 'r': return reduxValues('weather')
    case 't': return reduxValues('login')
    case 'k': return reduxKeys('')
    case 'p': return promptEval()
    case '1': return dispatch('TEMPERATURE_REQUEST', {city: 'Los Angeles'})
    case '2': return dispatch('TEMPERATURE_REQUEST', {city: 'New York'})
    case '3': return dispatch('TEMPERATURE_REQUEST', {city: 'San Francisco'})
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
