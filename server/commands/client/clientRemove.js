import {updateClients} from './clientHelpers'

const COMMAND = 'client.remove'

const process = (context, action) => {
  const {clients} = context
  const {socket} = action

  delete clients[socket.id]
  updateClients(context)
}

export default {
  name: COMMAND,
  process
}
