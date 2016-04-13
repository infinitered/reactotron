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

    const command = {type: 'hey', name: 'you'}
    socket.emit('command', JSON.stringify(command))
  })

  socket.on('disconnect', () => {
  })
})
