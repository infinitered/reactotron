import socketIO from 'socket.io'
import R, { without } from 'ramda'

export default ({ port, onConnect, onDisconnect, onCommand }) => {
  // hey, it's us!  a SocketIO Server!
  const io = socketIO(port)

  // a list of our connections
  let connections = []

  // the object to return which has our transport interface
  const transport = {}

  // has the ability to close
  transport.close = () => io.close()

  // has the ability to send
  transport.send = (command, commandPayload) => {
    io.sockets.emit(command, commandPayload)
  }

  // has the ability to stop
  transport.stop = () => {
    R.forEach(s => s && s.connected && s.disconnect(), R.pluck('socket', connections))
  }

  io.on('connection', socket => {
    // details about who has connected
    const id = socket.id
    const address = socket.request.connection.remoteAddress
    const transportConnection = { id, socket }

    connections.push(transportConnection)

    // trigger onConnect
    onConnect({ id, address })

    // when this client disconnects
    socket.on('disconnect', () => {
      onDisconnect(id)
      // remove them from the list
      without([transportConnection], connections)
    })

    // when we receive a command from the client
    socket.on('command', ({ type, payload }) => {
      onCommand(id, { type, payload })
    })
  })

  return transport
}
