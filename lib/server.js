import TerminalKit from 'terminal-kit'
import prettyJson from 'prettyjson'
import R from 'ramda'
import SocketIO from 'socket.io'

const term = TerminalKit.terminal
term.clear()

const PORT = 3334
const io = SocketIO(PORT)

io.on('connection', (socket) => {
  socket.on('event', (data) => {
    const action = JSON.parse(data)
    // console.log('event', json)
    term.white(`${new Date()}`)
    term.cyan(`[${action.type}] `)
    term(JSON.stringify(action.message, null, 2))
    // console.log(prettyJson.render(action.message, {
    //   keysColor: 'red',
    //   dashColor: 'magenta',
    //   stringColor: 'white'
    // }))
    term('\n\n')

    // const command = {type: 'hey', payload: {'you'}}
    // socket.emit('command', JSON.stringify(command))
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
}

term.on('key', (name, matches, data) => {
  if (name === 'CTRL_C') return die(0)
})

const replLoop = () => {
  term.blue('> ')
  term.inputField({}, (error, input) => {
    if (error) {
      term.red(error)
      die(1)
    }
    commmandSwitch(input)
    term('\n')
    replLoop()
  })
}

replLoop()
