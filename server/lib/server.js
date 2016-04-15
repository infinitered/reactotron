import TerminalKit from 'terminal-kit'
import prettyJson from 'prettyjson'
import R from 'ramda'
import SocketIO from 'socket.io'

const term = TerminalKit.terminal
term.clear()

const doc = term.createDocument({
  backgroundAttr: {
    dim: false
  }
})

const layout = TerminalKit.Layout.create({
  parent: doc,
  boxChars: 'double',
  layout: {
    id: 'main',
    y: 3,
    rows: [
      {
        id: 'rowtop',
        height: 4,
        columns: [
          {id: 'commandPanel', widthPercent: 100}
        ]
      },
      {
        id: 'row1',
        columns: [
          {id: 'logPanel', widthPercent: 50},
          {id: 'statusPanel', widthPercent: 50}
        ]
      }
    ]
  }
})

const loggingWindow = TerminalKit.Text.create({
  parent: doc.elements.logPanel,
  content: '',
  attr: {
    // color: 'brightMagenta',
    // bold: true
  }
})


const PORT = 3334
const io = SocketIO(PORT)

io.on('connection', (socket) => {
  socket.on('event', (data) => {
    const action = JSON.parse(data)
    // console.log('event', json)
    const guts = JSON.stringify(action.message, null, 2)
    term.saveCursor()
    loggingWindow.setContent(guts + '\n\n' + loggingWindow.getContent())
    term.restoreCursor()
    // term.white(`${new Date()}`)
    // term.cyan(`[${action.type}] `)
    // term()
    // console.log(prettyJson.render(action.message, {
    //   keysColor: 'red',
    //   dashColor: 'magenta',
    //   stringColor: 'white'
    // }))
    // term('\n\n')
  })

  socket.on('disconnect', () => {
  })
})


const sendCommand = (type, payload) => {
  const body = { type, payload }
  const bodyJson = JSON.stringify(body)
  io.sockets.emit('command', bodyJson)
}

const die = (exitCode = 0) => {
  term.white('\nYou are eaten by a grue.\n')
  term.grabInput(false)
  term.hideCursor(false)
  term.styleReset()
  process.exit()
}

const reduxValues = (path) => {
  sendCommand('redux.store', {path})
}

const reduxKeys = (path) => {
  sendCommand('redux.keys', {path})
}

const dispatch = (type, params = {}) => {
  sendCommand('redux.dispatch', {action: {type, ...params}})
}

const commmandSwitch = (input) => {
  switch (input) {
    case 'q': return die()
    case 'r': return reduxValues('weather')
    case 't': return reduxValues('login')
    case 'k': return reduxKeys('')
    case '1': return dispatch('TEMPERATURE_REQUEST', {city: 'Los Angeles'})
    case '2': return dispatch('TEMPERATURE_REQUEST', {city: 'New York'})
    case '3': return dispatch('TEMPERATURE_REQUEST', {city: 'San Francisco'})
  }
  commandField.inputTextBuffer.backDelete(10000)
}

const commandField = TerminalKit.TextInput.create({
  parent: doc.elements.commandPanel,
  label: '> ',
  width: 100
})
commandField.on('submit', commmandSwitch)
doc.focusNext()

term.on('key', (name, matches, data) => {
  if (name === 'CTRL_C') return die(0)
})

const replLoop = () => {
  // term.moveTo(1, 2)
  // term.blue('> ')
  // term.inputField({}, (error, input) => {
  //   if (error) {
  //     term.red(error)
  //     die(1)
  //   }
  //   commmandSwitch(input)
  //   replLoop()
  // })
}

replLoop()
