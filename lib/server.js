import TerminalKit from 'terminal-kit'
import prettyJson from 'prettyjson'
import R from 'ramda'
import SocketIO from 'socket.io'

const term = TerminalKit.terminal

const PORT = 3334
const io = SocketIO(PORT)

io.on('connection', (socket) => {
  socket.on('event', (data) => {
    const action = JSON.parse(data)
    // console.log('event', json)
    term.cyan(`[${action.type}]\n`)
    term(JSON.stringify(action.message, null, 2))
    // console.log(prettyJson.render(action.message, {
    //   keysColor: 'red',
    //   dashColor: 'magenta',
    //   stringColor: 'white'
    // }))
    term('\n')

    // const command = {type: 'hey', payload: {'you'}}
    // socket.emit('command', JSON.stringify(command))
  })

  socket.on('disconnect', () => {
  })
})

term.grabInput()

term.on('key', (name, matches, data) => {
  if (name === 'l') {
    const command = {
      type: 'log',
      payload: {
        name: 'Steve',
        age: 1000
      }
    }
    io.sockets.emit('command', JSON.stringify(command))
  }
  if (name === 'r') {
    const command = {
      type: 'redux.store',
      payload: { path: 'weather' }
    }
    io.sockets.emit('command', JSON.stringify(command))
  }
  if (name === 'k') {
    const command = {
      type: 'redux.keys',
      payload: { path: '' }
    }
    io.sockets.emit('command', JSON.stringify(command))
  }
  if (name === '1') {
    const command = {
      type: 'redux.dispatch',
      payload: { action: {type: 'TEMPERATURE_REQUEST', city: 'Los Angeles'} }
    }
    io.sockets.emit('command', JSON.stringify(command))
  }
  if (name === '2') {
    const command = {
      type: 'redux.dispatch',
      payload: { action: {type: 'TEMPERATURE_REQUEST', city: 'New York'} }
    }
    io.sockets.emit('command', JSON.stringify(command))
  }
  if (name === '3') {
    const command = {
      type: 'redux.dispatch',
      payload: { action: {type: 'TEMPERATURE_REQUEST', city: 'San Francisco'} }
    }
    io.sockets.emit('command', JSON.stringify(command))
  }
  console.log('key event:', name)

  // Detect CTRL-C and exit 'manually'
  if (name === 'CTRL_C') {
    process.exit()
  }
})
